import { mkdir, writeFile } from 'node:fs/promises';

const payload = {
  updatedAt: new Date().toISOString(),
  release: 'portfolio-os-monitor',
  owner: 'Abhishek Enaguthi',
  notes: [
    'Public controls only. Private actions stay behind GitHub or Rudhra.',
    'Live feeds are GitHub Pulse and Today.txt.',
    'Use this page as the agent handoff surface before deploys and larger redesign passes.'
  ],
  workflows: [
    {
      name: 'Deploy to GitHub Pages',
      cadence: 'on push to main',
      href: 'https://github.com/Abhishek21g/Abhishek21g.github.io/actions/workflows/deploy.yml'
    },
    {
      name: 'Update GitHub activity',
      cadence: 'every 6 hours',
      href: 'https://github.com/Abhishek21g/Abhishek21g.github.io/actions/workflows/update-github-activity.yml'
    }
  ]
};

await mkdir('public/ops', { recursive: true });
await writeFile('public/ops/status.json', `${JSON.stringify(payload, null, 2)}\n`);
