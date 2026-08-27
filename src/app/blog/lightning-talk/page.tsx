export default function LightningTalkPage() {
  return (
    <main className="min-h-screen bg-[#EDEAE2] text-[#14110D]">
      <div className="mx-auto max-w-4xl px-5 py-6 md:px-8 md:py-10">
        <nav className="mb-8 flex items-center justify-between font-mono text-xs text-[#14110D]/55">
          <a href="/" className="text-[#E2621B] hover:text-[#c9550f]">
            AE desktop
          </a>
          <a href="/blog/" className="hover:text-[#14110D]">
            back to blog
          </a>
        </nav>

        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#E2621B]">
          Oregon State AI Week · Talk + poster
        </p>
        <h1 className="font-serif text-4xl font-normal leading-[0.98] md:text-6xl">
          Future Infrastructure: Data Centers with Agentic AI and NVIDIA Omniverse
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5B5648]">
          April 2025 poster session and lightning talk. Authors: Abhishek Enaguthi,
          Wayne Wood, and Christopher M. Sullivan. College of Engineering, Oregon
          State University.
        </p>

        <figure className="mt-8 overflow-hidden rounded-[12px] border border-[#14110D]/10 bg-[#14110D] shadow-xl">
          <img
            src="/Blog1/aiweek-poster-osu.jpg"
            alt="Abhishek Enaguthi standing next to the AI Week poster Future Infrastructure: Data Centers with Agentic AI and NVIDIA Omniverse"
            className="max-h-[720px] w-full object-contain"
          />
          <figcaption className="border-t border-[#F6F2EA]/10 bg-[#14110D] px-4 py-3 font-mono text-[11px] text-[#F6F2EA]/55">
            Poster session: Abhi with the Future Infrastructure board
          </figcaption>
        </figure>

        <section className="mt-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[12px] border border-[#14110D]/10 bg-[#F6F2EA] p-6">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#E2621B]">
              Session card
            </h2>
            <dl className="mt-4 space-y-3 text-sm leading-6 text-[#3B3529]">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5B5648]">
                  Format
                </dt>
                <dd>Lightning talk + research poster</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5B5648]">
                  Venue
                </dt>
                <dd>Oregon State AI Week</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5B5648]">
                  Stack
                </dt>
                <dd>NVIDIA Omniverse, Isaac Sim, Modulus</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5B5648]">
                  Focus
                </dt>
                <dd>Digital twin, agentic AI, power and thermal</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-5 text-base leading-8 text-[#3B3529]">
            <p>
              At Oregon State AI Week we presented a digital twin of the Jen-Hsun
              Huang and Lori Mills Huang Collaborative Innovation Complex server
              room. The talk was simple: make the data center legible before you
              change the real hardware.
            </p>
            <p>
              The poster, Future Infrastructure: Data Centers with Agentic AI and
              NVIDIA Omniverse, walks through the vision, goals, and methodology.
              Multi-agent optimization over a live twin. PDU and electricity
              monitoring in the scene. Real-time power and thermal adjustments you
              can watch instead of only charting.
            </p>
            <p>
              Agentic AI here means controllers that can reason over power,
              cooling, and load, then propose actions against the twin. Omniverse
              is the shared scene where racks, sensors, airflow, and sliding doors
              stay in one place so operators and researchers can argue from the
              same picture.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[12px] border border-[#14110D]/10 bg-[#F6F2EA] p-6 md:p-8">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#E2621B]">
            What the talk covered
          </h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <p className="text-sm leading-7 text-[#3B3529]">
              Digital twin of the CIC server room: racks, sensors, doors, airflow.
              Enough fidelity to test layout and cooling ideas without touching
              production gear.
            </p>
            <p className="text-sm leading-7 text-[#3B3529]">
              Power and thermal loop: PDUs in the environment, live power reads,
              and demos of adjusting load and cooling while the room state updates
              in Omniverse.
            </p>
            <p className="text-sm leading-7 text-[#3B3529]">
              Agentic control angle: train agents for predictive maintenance and
              load balancing against that twin, not against a spreadsheet of
              averages.
            </p>
            <p className="text-sm leading-7 text-[#3B3529]">
              The crowd favorite was the self-opening sliding door. Small
              interaction, big reaction, and a reminder that systems demos land
              when the constraint is visible.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-[12px] border border-[#14110D]/10 bg-[#14110D]">
            <img
              src="/media/aiweek-wide.jpg"
              alt="AI Week demo table and Omniverse scene"
              className="h-56 w-full object-contain"
            />
            <figcaption className="px-3 py-2 font-mono text-[11px] text-[#F6F2EA]/50">
              Demo table and Omniverse scene
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-[12px] border border-[#14110D]/10 bg-[#14110D]">
            <img
              src="/Blog1/IMG_4170.jpeg"
              alt="Project table and poster setup at AI Week"
              className="h-56 w-full object-contain"
            />
            <figcaption className="px-3 py-2 font-mono text-[11px] text-[#F6F2EA]/50">
              Project table and poster setup
            </figcaption>
          </figure>
        </section>
      </div>
    </main>
  )
}
