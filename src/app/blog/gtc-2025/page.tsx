import BlogArticlePage from '@/components/BlogArticlePage'

export const metadata = {
  title: 'GTC 2025 - Abhishek Enaguthi',
  description:
    'Notes from NVIDIA GTC 2025 in San Jose: Omniverse twin pitch, hallway sessions, and the Future Infrastructure poster.',
}

export default function Gtc2025TalkPage() {
  return (
    <BlogArticlePage
      date="March 2025"
      hero="/media/gtc-2025-poster.jpg"
      heroAlt="Abhishek with the research poster Future Infrastructure: Data Centers with Agentic AI and NVIDIA Omniverse"
      heroLayout="top"
      kicker="NVIDIA GTC 2025 · San Jose"
      title="What we took to GTC: GPUs, compilers, and the twin pitch"
      paragraphs={[
        'March 2025. Not a keynote slot. A week of short talks, demos, and hallway sessions with the people who actually ship GPU software.',
        'GTC is the week where every conversation eventually lands on the same few questions: what is the bottleneck, who owns the stack, and can you show the failure mode instead of describing it.',
        'We treated those hallway sessions like mini talks. I opened with the Collaborative Innovation Complex server-room twin, then stayed on the parts that matter for operators: how power and thermal signals show up in the scene, how agentic control loops could act on that state, and where Omniverse sits relative to the real floor.',
        'The useful part was not the tourist campus shots. It was the debugging with people who have shipped at scale. Caught up with folks from NVIDIA, including Nader Khalil, and compared notes on where inference stacks and real HPC deployments still hurt.',
        'Left with a longer list of experiments to run and a shorter list of things I pretend are solved.',
      ]}
      media={[
        {
          src: '/media/img_9799.jpg',
          alt: 'Abhishek Enaguthi with Nader Khalil at NVIDIA GTC 2025',
        },
        {
          src: '/media/img_9593.jpg',
          alt: '#GTC25 sign outside the San Jose convention center',
        },
      ]}
    />
  )
}
