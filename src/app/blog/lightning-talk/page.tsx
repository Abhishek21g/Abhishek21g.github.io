import BlogArticlePage from '@/components/BlogArticlePage'

export default function LightningTalkPage() {
  return (
    <BlogArticlePage
      date="April 2025"
      hero="/media/aiweek-wide.jpg"
      kicker="OSU AI Week"
      title="Digital Twins, the CIC, and Our Omniverse Demo"
      paragraphs={[
        "At Oregon State's AI Week, I shared our work on a digital twin of the Jen-Hsun Huang and Lori Mills Huang Collaborative Innovation Complex server room.",
        "The project is a virtual replica of the room: racks, sensors, sliding doors, airflow, and the pieces you need to reason about a data center before changing the real hardware.",
        "That mattered because the demo made the infrastructure legible. Instead of saying layout and cooling choices are important, people could watch those choices play out in the scene.",
        "The crowd favorite was the self-opening sliding door. Small interaction, big reaction, and a useful reminder that systems demos work best when the constraint is visible.",
      ]}
      media={[
        { src: '/media/aiweek-close.jpg', alt: 'AI Week lightning talk close-up' },
        { src: '/Blog1/IMG_4170.jpeg', alt: 'Project table and poster setup' },
        { src: '/Blog1/IMG_4171.jpeg', alt: 'Digital twin demo details' },
      ]}
    />
  )
}
