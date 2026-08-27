import BlogArticlePage from '@/components/BlogArticlePage'

export const metadata = {
  title: 'OSU AI Week Lightning Talk - Abhishek Enaguthi',
  description:
    'Oregon State AI Week lightning talk on the CIC digital twin, Omniverse, and agentic control for data centers.',
}

export default function LightningTalkPage() {
  return (
    <BlogArticlePage
      date="April 2025"
      hero="/media/aiweek-close.jpg"
      heroAlt="Abhishek on stage at Oregon State AI Week giving the Omniverse lightning talk"
      heroLayout="top"
      kicker="OSU AI Week · Lightning talk"
      title="Digital Twins, the CIC, and Our Omniverse Demo"
      paragraphs={[
        "At Oregon State's AI Week, I shared our work on a digital twin of the Jen-Hsun Huang and Lori Mills Huang Collaborative Innovation Complex server room.",
        'The project is a virtual replica of the room: racks, sensors, sliding doors, airflow, and the pieces you need to reason about a data center before changing the real hardware.',
        'That mattered because the demo made the infrastructure legible. Instead of saying layout and cooling choices are important, people could watch those choices play out in the scene.',
        'Agentic AI here means controllers that can reason over power, cooling, and load, then propose actions against the twin. Omniverse is the shared scene where racks, sensors, airflow, and sliding doors stay in one place so operators and researchers can argue from the same picture.',
        'The crowd favorite was the self-opening sliding door. Small interaction, big reaction, and a useful reminder that systems demos work best when the constraint is visible.',
      ]}
      media={[
        {
          src: '/media/aiweek-wide.jpg',
          alt: 'Wide shot of the AI Week lightning talk stage and slide deck',
        },
        {
          src: '/Blog1/IMG_4170.jpeg',
          alt: 'Project table and demo setup at AI Week',
        },
      ]}
    />
  )
}
