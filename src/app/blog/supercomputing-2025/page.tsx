export const metadata = {
  title: 'SC25 Talk + Team Oregon - Abhishek Enaguthi',
  description:
    'Booth talk at Oregon Innovates, Link Oregon floor days, and leading Team Oregon through the SC25 competition in St. Louis.',
}

export default function Supercomputing2025Page() {
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
            <span>SC25</span>
          </div>
        </nav>

        <header className="mb-6 border-b border-[#F6F2EA]/12 pb-6">
          <p className="mb-3 font-mono text-[11px] text-[#F6F2EA]/45">
            November 2025 · St. Louis · Oregon Innovates / Link Oregon
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Talk and Team Oregon at Supercomputing 2025
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#F6F2EA]/70">
            Three jobs in one week: a booth talk at Oregon Innovates, days on the
            show floor with Link Oregon, and leading Team Oregon through the
            student competition.
          </p>
        </header>

        <figure className="mb-8 overflow-hidden rounded-md border border-[#F6F2EA]/10 bg-black">
          <img
            src="/media/sc25-collage.jpg"
            alt="SC25 collage: Oregon Innovates booth, Team Oregon, competition table, and booth talk"
            className="mx-auto max-h-[640px] w-full object-contain"
          />
          <figcaption className="border-t border-[#F6F2EA]/10 px-4 py-3 font-mono text-[11px] text-[#F6F2EA]/45">
            Oregon Innovates booth · Team Oregon · competition table · podium talk
          </figcaption>
        </figure>

        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Talk', body: 'Oregon Innovates booth podium for a small floor audience' },
            { label: 'Floor', body: 'Link Oregon outpost: visitors, demos, Oregon school stack' },
            { label: 'Team', body: 'Led Team Oregon through competition days and handoffs' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-md border border-[#F6F2EA]/10 bg-[#14110D] px-4 py-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#E2621B]">
                {item.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#F6F2EA]/75">{item.body}</p>
            </div>
          ))}
        </div>

        <article className="mx-auto max-w-3xl space-y-8 text-[15px] leading-7 text-[#F6F2EA]/82">
          <section className="space-y-4">
            <h2 className="font-mono text-[11px] text-[#F6F2EA]/45">The talk</h2>
            <p>
              At the Oregon Innovates booth I stood at the podium and talked through
              our work for a small floor audience. Chairs close to the screen, people
              drifting in mid-sentence and staying. The slide deck was a field-note
              style recap of how we got here, not a product pitch.
            </p>
            <p>
              Behind me the sponsor banner was hard to miss: NVIDIA, Mark III
              Systems, PIVIT, and the Oregon university logos. Same Oregon stack that
              sponsored the booth presence all week.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-mono text-[11px] text-[#F6F2EA]/45">
              Booth and Oregon Innovates
            </h2>
            <p>
              We lived on the Oregon Innovates floor with Link Oregon. Crater Lake
              backdrop, purple carpet, gray chairs, a white table with a laptop always
              open. The Linus Pauling line on the wall set the tone: the best way to
              have a good idea is to have a lot of ideas.
            </p>
            <p>
              Booth days meant walking visitors through what Team Oregon and the
              Oregon schools were doing in HPC, then pointing them toward the people
              who could go deeper. Less polished demo theater than SC24&apos;s digital
              twin loop, more of a working Oregon outpost on the SC25 floor.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-mono text-[11px] text-[#F6F2EA]/45">
              Leading Team Oregon
            </h2>
            <p>
              I led Team Oregon through the competition days. Black tablecloth,
              laptops and power bricks everywhere, the SC25 St. Louis banner behind
              us. The role was pacing: who owns the next run, when to stop chasing a
              broken build, how to hand off without dropping the thread.
            </p>
            <p>
              The group photo in front of the Link Oregon screen is the clean version
              of that week. The competition table is the real one. Same navy vests,
              same badges, a lot more cable management and quiet urgency.
            </p>
          </section>
        </article>

        <footer className="mt-12 border-t border-[#F6F2EA]/12 pt-6 font-mono text-[11px] leading-6 text-[#F6F2EA]/45">
          <p className="mb-2 text-[#F6F2EA]/55">More talks</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="/blog/supercomputing-2024/" className="text-[#E2621B] hover:text-[#ff7a32]">
              SC24 Omniverse twin
            </a>
            <span>·</span>
            <a href="/blog/gtc-2025/" className="text-[#E2621B] hover:text-[#ff7a32]">
              GTC 2025
            </a>
            <span>·</span>
            <a href="/blog/lightning-talk/" className="text-[#E2621B] hover:text-[#ff7a32]">
              AI Week
            </a>
            <span>·</span>
            <a href="/blog/" className="text-[#E2621B] hover:text-[#ff7a32]">
              full index
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
