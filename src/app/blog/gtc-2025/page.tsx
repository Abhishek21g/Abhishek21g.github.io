export default function Gtc2025TalkPage() {
  return (
    <main className="min-h-screen bg-[#0B0A09] text-[#F6F2EA]">
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-10">
        <nav className="mb-8 flex items-center justify-between font-mono text-xs text-[#F6F2EA]/50">
          <a href="/" className="text-[#E2621B] hover:text-[#ff7a32]">
            AE desktop
          </a>
          <a href="/blog/" className="hover:text-white">
            back to blog
          </a>
        </nav>

        <header className="mb-8 border-b border-[#F6F2EA]/12 pb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#E2621B]">
            <span>Talk writeup</span>
            <span className="text-[#F6F2EA]/25">/</span>
            <span>NVIDIA GTC 2025</span>
            <span className="text-[#F6F2EA]/25">/</span>
            <span>San Jose</span>
          </div>
          <h1 className="max-w-3xl font-serif text-4xl font-normal leading-[0.98] md:text-6xl">
            What we took to GTC: GPUs, compilers, and the twin pitch
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#F6F2EA]/70">
            March 2025. Not a keynote slot. A week of short talks, demos, and hallway
            sessions with the people who actually ship GPU software.
          </p>
        </header>

        <div className="mb-10 overflow-hidden rounded-md border border-[#F6F2EA]/10 bg-black">
          <img
            src="/media/img_9799.jpg"
            alt="Abhishek Enaguthi with Nader Khalil at NVIDIA GTC 2025"
            className="max-h-[520px] w-full object-contain"
          />
          <p className="border-t border-[#F6F2EA]/10 px-4 py-3 font-mono text-[11px] text-[#F6F2EA]/45">
            GTC 2025 with Nader Khalil (NVIDIA)
          </p>
        </div>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-[#F6F2EA]/12 bg-[#14110D] p-5">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#E2621B]">
              What we gave
            </p>
            <p className="text-sm leading-6 text-[#F6F2EA]/80">
              A walkthrough of the OSU CIC digital twin in NVIDIA Omniverse: racks,
              live sensor hooks, power and thermal reasoning, and why a virtual
              data center beats a slide deck when you are arguing about layout.
            </p>
          </div>
          <div className="rounded-md border border-[#F6F2EA]/12 bg-[#14110D] p-5">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#E2621B]">
              Audience
            </p>
            <p className="text-sm leading-6 text-[#F6F2EA]/80">
              NVIDIA engineers, compiler and inference folks, and HPC builders who
              live in memory bandwidth, kernel fusion, and whether the benchmark
              lied.
            </p>
          </div>
          <div className="rounded-md border border-[#F6F2EA]/12 bg-[#14110D] p-5">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#E2621B]">
              Demo thread
            </p>
            <p className="text-sm leading-6 text-[#F6F2EA]/80">
              Show the scene, not the brochure. Point at heat, power, and rack
              choices inside the twin, then trade notes on ROCm, serving stacks,
              and what still needs a receipt before you trust it.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-3xl space-y-6 text-base leading-8 text-[#F6F2EA]/82">
          <p>
            GTC is the week where every conversation eventually lands on the same
            few questions: what is the bottleneck, who owns the stack, and can you
            show the failure mode instead of describing it.
          </p>
          <p>
            We treated those hallway sessions like mini talks. I opened with the
            Collaborative Innovation Complex server-room twin, then stayed on the
            parts that matter for operators: how power and thermal signals show up
            in the scene, how agentic control loops could act on that state, and
            where Omniverse sits relative to the real floor.
          </p>
          <p>
            The useful part was not the tourist campus shots. It was the debugging
            with people who have shipped at scale. Caught up with folks from
            NVIDIA, including Nader Khalil, and compared notes on where inference
            stacks and real HPC deployments still hurt.
          </p>
          <p>
            Left with a longer list of experiments to run and a shorter list of
            things I pretend are solved.
          </p>
        </article>

        <figure className="mt-10 overflow-hidden rounded-md border border-[#F6F2EA]/10 bg-black">
          <img
            src="/media/img_9593.jpg"
            alt="#GTC25 sign outside the San Jose convention center"
            className="max-h-[420px] w-full object-contain"
          />
          <figcaption className="border-t border-[#F6F2EA]/10 px-4 py-3 font-mono text-[11px] text-[#F6F2EA]/45">
            #GTC25 outside the San Jose convention center
          </figcaption>
        </figure>
      </div>
    </main>
  )
}
