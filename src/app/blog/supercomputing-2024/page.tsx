import BlogArticlePage from '@/components/BlogArticlePage'

export const metadata = {
  title: 'Repping OSU at Supercomputing 2024 - Abhishek Enaguthi',
  description:
    'SC24 floor notes from Atlanta: CIC Omniverse twin demo at Oregon Innovates / Link Oregon, Quest on the show floor, and talking systems with HPC folks.',
}

export default function Supercomputing2024Page() {
  return (
    <BlogArticlePage
      date="November 2024"
      hero="/media/sc24-quest-hero.jpg"
      heroAlt="Abhishek on the SC24 show floor in a Meta Quest headset with controllers"
      heroLayout="top"
      kicker="SC24 Atlanta · Oregon Innovates / Link Oregon"
      title="Repping OSU at Supercomputing 2024"
      paragraphs={[
        'This was our first time bringing the CIC digital twin onto a national supercomputing floor. We stood at the Oregon Innovates / Link Oregon booth for Oregon State and ran a live demo of the Collaborative Innovation Complex server room built in NVIDIA Omniverse.',
        'The loop was simple. Headset on, twin on the monitor, walk someone through racks, sensors, heat, and layout choices they could see instead of only hear about. The smart sliding door kept pulling people into the conversation. Once they were in the scene, the hard questions started: what data feeds the twin, how faithful is the physics, what would you trust enough to change in a real room.',
        'Booth days were long in the best way. Fitting Quest headsets for visitors, pointing at the Omniverse view while they looked around, then handing the story off to whoever needed the deeper systems answer. NVIDIA, Dell, Google, university labs, and random HPC folks drifted through the same purple-carpet Oregon outpost.',
        'What stuck with me is that systems work lands differently when the constraint has shape. Cooling, memory, movement, scheduling, and data flow stop feeling abstract when they live inside a working scene you can stand in for a minute.',
      ]}
      media={[
        {
          src: '/media/sc24-demo-visitor.jpg',
          alt: 'Walking a visitor through the Omniverse twin on the booth monitor while they wear the Quest',
        },
        {
          src: '/media/sc24-headset-assist.jpg',
          alt: 'Fitting a Meta Quest headset for a visitor at the Oregon Innovates booth',
        },
      ]}
    />
  )
}
