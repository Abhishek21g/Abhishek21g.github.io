import BlogArticlePage from '@/components/BlogArticlePage'

export const metadata = {
  title: 'GTC 2025 - Abhishek Enaguthi',
  description:
    'Talk writeup from NVIDIA GTC 2025 in San Jose: Omniverse, the OSU CIC digital twin, and data center simulation on the floor.',
}

export default function Gtc2025TalkPage() {
  return (
    <BlogArticlePage
      date="March 2025"
      kicker="NVIDIA GTC 2025 · San Jose"
      title="Omniverse, the CIC twin, and talking data centers at GTC"
      paragraphs={[
        'March 2025, NVIDIA GTC in San Jose. Not a keynote. A week of short sessions, demos, and hallway talks with people who live in GPU software and data center reality.',
        'What we brought was the same thread we had started on the SC floor: a digital twin of the Jen-Hsun Huang and Lori Mills Huang Collaborative Innovation Complex server room at Oregon State, built in NVIDIA Omniverse. The point was not a pretty 3D tour. It was a practical simulation of the room so you could argue about racks, sensors, power, and cooling from one shared scene.',
      ]}
      sections={[
        {
          heading: 'What we talked about',
          paragraphs: [
            'The talk usually opened the same way. Here is the CIC server room as a twin. Here is how live sensor hooks and thermal state show up in the scene. Here is where Omniverse sits relative to the real floor: a place to try layout and control ideas before you touch hardware.',
            'From there it went into the agentic angle we also put on the Future Infrastructure poster: controllers that can reason over power, cooling, and load, then propose actions against the twin instead of guessing from a slide. Data center simulation only helps if the picture is honest enough that an operator would trust it.',
            'I kept the pitch tight. Show the room. Name the signals. Say what is in the twin and what is still a research question. People at GTC will interrupt you the second you hand-wave a failure mode, so I tried to leave that door open on purpose.',
          ],
        },
        {
          heading: 'On the floor',
          paragraphs: [
            'Most of the useful conversations were not theater. They were five or ten minutes with someone who had shipped something adjacent: how do you keep the twin tied to real telemetry, where does the control loop stop being a demo, what breaks when the model of the room drifts from the room.',
            'Caught up with folks from NVIDIA, including Nader Khalil, and traded notes on where inference stacks and real HPC deployments still hurt. Same questions every time. What is the bottleneck. Who owns the stack. Can you show the failure mode instead of describing it.',
            'SC24 had already put the twin in front of HPC people. GTC was a different room: more GPU software, more people who wanted the simulation story to connect to how clusters actually run. The twin held up as a bridge between those worlds.',
          ],
        },
        {
          heading: 'What I took home',
          paragraphs: [
            'I left with a longer list of experiments to run and a shorter list of things I pretend are solved. The twin is useful when it makes infrastructure legible. It is not useful when it becomes a brochure for a building that does not exist yet.',
            'If you want the earlier floor version of this work, the SC24 writeup is still up. The AI Week lightning talk covers the same CIC and Omniverse thread in a campus talk format. This page is just what we said at GTC, without the photo dump.',
          ],
        },
      ]}
    />
  )
}
