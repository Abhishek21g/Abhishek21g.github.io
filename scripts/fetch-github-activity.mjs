import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const outputPath = process.argv[2] || 'public/live/github-activity.json';
const token = process.env.GITHUB_TOKEN;
const login = process.env.GITHUB_LOGIN || 'Abhishek21g';

const query = `
  query UserContributionGraph($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoriesWithContributedCommits
      }
    }
  }
`;

function contributionLevel(count) {
  if (!count) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function currentStreak(cells) {
  let streak = 0;
  for (let i = cells.length - 1; i >= 0; i -= 1) {
    if (!cells[i].count) break;
    streak += 1;
  }
  return streak;
}

async function writeJson(payload) {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
}

function fallbackPayload(status, message) {
  return {
    source: 'github',
    login,
    status,
    updatedAt: new Date().toISOString(),
    windowDays: 98,
    totals: {
      contributions: 0,
      commits: 0,
      pullRequests: 0,
      issues: 0,
      repositories: 0
    },
    currentStreak: 0,
    cells: [],
    error: message
  };
}

async function main() {
  if (!token) {
    await writeJson(fallbackPayload('fallback', 'GITHUB_TOKEN is not available in this environment'));
    return;
  }

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'enaguthi-portfolio-github-activity'
    },
    body: JSON.stringify({ query, variables: { login } })
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL returned ${response.status}`);
  }

  const json = await response.json();
  if (json.errors && json.errors.length) {
    throw new Error(json.errors.map((error) => error.message).join('; '));
  }

  const collection = json.data?.user?.contributionsCollection;
  const calendar = collection?.contributionCalendar;
  if (!collection || !calendar) {
    throw new Error(`No public contribution calendar found for ${login}`);
  }

  const cells = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .slice(-98)
    .map((day) => ({
      date: day.date,
      count: Number(day.contributionCount || 0),
      level: contributionLevel(Number(day.contributionCount || 0)),
      title: `${day.date}: ${Number(day.contributionCount || 0)} public contributions`
    }));

  await writeJson({
    source: 'github',
    login,
    status: 'live',
    updatedAt: new Date().toISOString(),
    windowDays: cells.length,
    totals: {
      contributions: Number(calendar.totalContributions || 0),
      commits: Number(collection.totalCommitContributions || 0),
      pullRequests: Number(collection.totalPullRequestContributions || 0),
      issues: Number(collection.totalIssueContributions || 0),
      repositories: Number(collection.totalRepositoriesWithContributedCommits || 0)
    },
    currentStreak: currentStreak(cells),
    cells
  });
}

main().catch(async (error) => {
  await writeJson(fallbackPayload('error', error.message));
  process.exitCode = 1;
});
