export const metadata = {
  title: 'Data Center Simulation - Abhishek Enaguthi',
  description: 'Data Center Simulation.',
}

export default function DataCenterSimulationPage() {
  return (
    <main className="min-h-screen bg-[#14110D] text-[#F6F2EA]">
      <div className="mx-auto max-w-4xl px-5 py-5 md:px-8 md:py-8">
        <nav className="mb-6 flex items-center justify-between font-mono text-xs text-[#F6F2EA]/55">
          <a href="/" className="text-[#E2621B] hover:text-[#ff7a32]">
            AE desktop
          </a>
          <a href="/blog/" className="hover:text-white">
            back to blog
          </a>
        </nav>

        <article className="overflow-hidden rounded-[10px] border border-[#F6F2EA]/10 bg-[#F6F2EA] text-[#14110D] shadow-2xl">
          <div className="flex h-9 items-center gap-2 border-b border-[#14110D]/10 bg-[#EDEAE2] px-4">
            <span className="h-[11px] w-[11px] rounded-full bg-[#E2621B]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#14110D]/15" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#14110D]/15" />
            <span className="ml-auto mr-auto font-mono text-[11px] text-[#5B5648]">Blog.readme</span>
          </div>

          <div className="p-6 md:p-10">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#E2621B]">Field notes</p>
            <h1 className="font-serif text-4xl font-normal leading-[0.98] md:text-6xl">Data Center Simulation</h1>

            <div className="mt-8 overflow-hidden rounded-md bg-black">
              <video controls playsInline poster="/project-x/poster.jpg" className="w-full">
                <source src="/project-x/project-x.mp4" type="video/mp4" />
              </video>
            </div>

            <p className="mt-6 text-sm leading-6 text-[#5B5648]">
              This system was also shown at{' '}
              <a href="/blog/supercomputing-2024/" className="text-[#E2621B] underline hover:text-[#c9550f]">
                Supercomputing 2024
              </a>
              .
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}
