export const metadata = {
  title: 'SC24 Talk + Demo: Omniverse Digital Twin - Abhishek Enaguthi',
  description:
    'Talk and live demo notes from Supercomputing 2024: NVIDIA Omniverse digital twin of the CIC server room on the Oregon Innovates / Link Oregon show floor.',
}

export default function Supercomputing2024Page() {
  return (
    <main className="min-h-screen bg-[#0B0A09] text-[#F6F2EA]">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-10">
        <nav className="mb-6 flex items-center justify-between font-mono text-xs text-[#F6F2EA]/50">
          <a href="/" className="text-[#E2621B] hover:text-[#ff7a32]">
            AE desktop
          </a>
          <div className="flex items-center gap-4">
            <a href="/blog/" className="hover:text-white">
              blog index
            </a>
            <span>SC24</span>
          </div>
        </nav>

        <header className="mb-6 border-b border-[#F6F2EA]/12 pb-6">
          <p className="mb-3 font-mono text-[11px] text-[#F6F2EA]/45">
            November 2024 · Atlanta · Talk + live demo
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Omniverse digital twin on the show floor
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#F6F2EA]/70">
            Oregon State. CIC server-room twin in NVIDIA Omniverse. Oregon Innovates
            / Link Oregon booth. Researchers and developers walking the floor,
            headset on, twin on the monitor.
          </p>

          <dl className="mt-6 grid gap-3 border-t border-[#F6F2EA]/12 pt-5 font-mono text-[11px] text-[#F6F2EA]/55 sm:grid-cols-3">
            <div>
              <dt className="text-[#E2621B]">Format</dt>
              <dd className="mt-1 text-[#F6F2EA]/85">Floor talk + VR demo</dd>
            </div>
            <div>
              <dt className="text-[#E2621B]">Venue</dt>
              <dd className="mt-1 text-[#F6F2EA]/85">SC24 · Atlanta booth</dd>
            </div>
            <div>
              <dt className="text-[#E2621B]">Stack</dt>
              <dd className="mt-1 text-[#F6F2EA]/85">Omniverse · CIC twin</dd>
            </div>
          </dl>
        </header>

        <figure className="mb-8 overflow-hidden rounded-md border border-[#F6F2EA]/10 bg-black">
          <img
            src="/media/sc24-quest-floor.jpg"
            alt="Abhishek on the SC24 show floor in an OSU Nike polo, wearing a Meta Quest headset with controllers"
            className="h-auto w-full object-cover"
          />
          <figcaption className="border-t border-[#F6F2EA]/10 px-4 py-3 font-mono text-[11px] leading-5 text-[#F6F2EA]/45">
            Quest on the SC24 floor. Demo posture: headset up, twin running, people
            stopping to ask what they are looking at.
          </figcaption>
        </figure>

        <article className="mx-auto max-w-3xl space-y-8 text-[15px] leading-7 text-[#F6F2EA]/82">
          <section className="space-y-4">
            <h2 className="font-mono text-[11px] text-[#F6F2EA]/45">The open</h2>
            <p>
              Okay so this was SC24 in Atlanta, and we were at the Oregon Innovates /
              Link Oregon booth repping Oregon State. First time we took the CIC
              digital twin onto a national supercomputing floor. Not a slide deck
              about digital twins. A working scene people could step into.
            </p>
            <p>
              The project is a virtual replica of the Jen-Hsun Huang and Lori Mills
              Huang Collaborative Innovation Complex server room, built in NVIDIA
              Omniverse. Racks. Sensors. Airflow. Layout choices you usually only
              argue about in tickets and CAD. We had about eight people on the twin
              work with Chris. My job on the floor was simple: talk the system, run
              the demo, answer whoever stopped.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-[11px] text-[#F6F2EA]/45">
              What we showed
            </h2>
            <ol className="space-y-4 border-l border-[#F6F2EA]/15 pl-5">
              {[
                {
                  title: 'The room, not a render',
                  body: 'Walk the virtual server room. Point at racks. Talk through how the twin maps to the real CIC space so researchers are not staring at abstract boxes.',
                },
                {
                  title: 'Sensors and heat in the scene',
                  body: 'Live sensor readouts and heat maps inside the twin. Cooling stops being a slide bullet when you can see the constraint move.',
                },
                {
                  title: 'Rack layout as a question',
                  body: 'Change a layout idea in the twin and talk about what that does to airflow and access before anyone touches metal.',
                },
                {
                  title: 'The sliding door',
                  body: 'Smart sliding door interaction. Small moment. People remember it. It pulls them into the rest of the stack.',
                },
              ].map((item, index) => (
                <li key={item.title} className="relative">
                  <span className="absolute -left-[1.55rem] top-1 font-mono text-[10px] text-[#E2621B]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="font-medium text-[#F6F2EA]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#F6F2EA]/65">{item.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <figure className="overflow-hidden rounded-md border border-[#F6F2EA]/10 bg-black">
            <img
              src="/media/sc24-omniverse-demo.jpg"
              alt="Live Omniverse digital twin demo on the SC24 show floor with Quest headset and twin on the monitor"
              className="h-auto w-full object-cover"
            />
            <figcaption className="border-t border-[#F6F2EA]/10 px-4 py-3 font-mono text-[11px] leading-5 text-[#F6F2EA]/45">
              Live demo · Omniverse twin on the booth monitor, Quest on a visitor, me
              talking through the scene.
            </figcaption>
          </figure>

          <section className="space-y-4">
            <h2 className="font-mono text-[11px] text-[#F6F2EA]/45">Who it was for</h2>
            <p>
              The audience on that floor is not a classroom. HPC researchers. Systems
              people. Developers who build and run large machines. They ask hard
              questions fast: what is instrumented, what is simulated, what is just
              pretty 3D. Fair. The twin is strongest when you treat it as
              instrumentation and validation across a facility, not a tour of shiny
              racks.
            </p>
            <p>
              So the talk stayed practical. Here is the room. Here is the sensor
              path. Here is a layout decision you can rehearse before you commit. If
              someone wanted the headset, they got the headset. If they wanted the
              systems story, we stayed on the monitor and walked the data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-mono text-[11px] text-[#F6F2EA]/45">Why it mattered</h2>
            <p>
              Strong systems work gets easier to communicate when the constraint has
              shape. Cooling, memory pressure, movement through a room, scheduling,
              data flow. On a booth you only get a few minutes. A working Omniverse
              scene buys you those minutes. People stop guessing what you mean by
              layout or heat and start arguing about the actual tradeoff.
            </p>
            <p>
              That was the win for me at SC24. Not a brochure line about digital
              twins. Standing on the floor, Quest up or twin on screen, making
              infrastructure legible to the people who live in it.
            </p>
          </section>
        </article>

        <footer className="mt-12 border-t border-[#F6F2EA]/12 pt-6 font-mono text-[11px] leading-6 text-[#F6F2EA]/45">
          <p className="mb-2 text-[#F6F2EA]/55">More talks</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="/blog/supercomputing-2025/" className="text-[#E2621B] hover:text-[#ff7a32]">
              SC25 Team Oregon
            </a>
            <span>·</span>
            <a href="/blog/data-center-simulation/" className="text-[#E2621B] hover:text-[#ff7a32]">
              Data Center Simulation
            </a>
            <span>·</span>
            <a href="/blog/lightning-talk/" className="text-[#E2621B] hover:text-[#ff7a32]">
              AI Week
            </a>
            <span>·</span>
            <a href="/blog/gtc-2025/" className="text-[#E2621B] hover:text-[#ff7a32]">
              GTC 2025
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
