import BlogArticlePage from '@/components/BlogArticlePage'

export const metadata = {
  title: 'SC24 Talk + Demo: Omniverse Digital Twin - Abhishek Enaguthi',
  description:
    'Talk and live demo notes from Supercomputing 2024: NVIDIA Omniverse digital twin of the CIC server room on the Oregon Innovates / Link Oregon show floor.',
}

export default function Supercomputing2024Page() {
  return (
    <BlogArticlePage
      date="November 2024"
      hero="/media/sc24-robot.jpg"
      heroAlt="Abhishek next to a humanoid robot statue on the SC24 show floor, NVIDIA SC24 badge, OSU Nike polo"
      heroLayout="top"
      kicker="SC24 · Atlanta · Talk + live demo"
      title="Omniverse digital twin on the show floor"
      paragraphs={[
        'Okay so this was SC24 in Atlanta, and we were at the Oregon Innovates / Link Oregon booth repping Oregon State. First time we took the CIC digital twin onto a national supercomputing floor. Not a slide deck about digital twins. A working scene people could step into.',
        'The project is a virtual replica of the Jen-Hsun Huang and Lori Mills Huang Collaborative Innovation Complex server room, built in NVIDIA Omniverse. Racks. Sensors. Airflow. Layout choices you usually only argue about in tickets and CAD. We had about eight people on the twin work with Chris. My job on the floor was simple: talk the system, run the demo, answer whoever stopped.',
        'We walked visitors through the room itself, not a render. Sensor readouts and heat maps lived in the scene. Rack layout became a question you could rehearse before anyone touched metal. The smart sliding door was a small moment people remembered, and it pulled them into the rest of the stack.',
        'The audience on that floor is not a classroom. HPC researchers. Systems people. Developers who build and run large machines. They ask hard questions fast: what is instrumented, what is simulated, what is just pretty 3D. Fair. The twin is strongest when you treat it as instrumentation and validation across a facility, not a tour of shiny racks.',
        'That was the win for me at SC24. Standing on the floor, Quest up or twin on screen, making infrastructure legible to the people who live in it.',
      ]}
      media={[
        {
          src: '/media/sc24-quest-floor.jpg',
          alt: 'Abhishek on the SC24 show floor in a Meta Quest headset with controllers',
        },
      ]}
    />
  )
}
