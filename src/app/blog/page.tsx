const posts = [
  {
    date: 'November 2025',
    excerpt:
      'Booth talk at Oregon Innovates, Link Oregon floor days, and leading Team Oregon through the SC25 competition in St. Louis.',
    href: '/blog/supercomputing-2025/',
    title: 'Talk and Team Oregon at Supercomputing 2025',
  },
  {
    date: 'April 2025',
    excerpt:
      'Oregon State AI Week talk and poster: digital twins, agentic AI, Omniverse, and data-center power and thermal.',
    href: '/blog/lightning-talk/',
    title: 'Future Infrastructure: Data Centers with Agentic AI and NVIDIA Omniverse',
  },
  {
    date: 'March 2025',
    excerpt:
      'Talk writeup from NVIDIA GTC in San Jose: what we pitched, who listened, and the Omniverse twin demo thread.',
    href: '/blog/gtc-2025/',
    title: 'What we took to GTC: GPUs, compilers, and the twin pitch',
  },
  {
    date: 'November 2024',
    excerpt:
      'Talk + live demo notes from SC24: CIC Omniverse twin on the Oregon Innovates floor, Quest headset, researchers and developers.',
    href: '/blog/supercomputing-2024/',
    title: 'Omniverse digital twin on the show floor',
  },
  {
    date: 'October 2024',
    excerpt: 'Data Center Simulation.',
    href: '/blog/data-center-simulation/',
    title: 'Data Center Simulation',
  },
]

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-[#0B0A09] px-5 py-6 text-[#F6F2EA] md:px-8">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-8 flex items-center justify-between font-mono text-xs text-[#F6F2EA]/50">
          <a href="/" className="text-[#E2621B] hover:text-[#ff7a32]">
            AE desktop
          </a>
          <span>blog/</span>
        </nav>

        <header className="mb-6 border-b border-[#F6F2EA]/12 pb-5">
          <h1 className="text-2xl font-semibold tracking-tight">Talks and field notes</h1>
          <p className="mt-2 font-mono text-[11px] text-[#F6F2EA]/45">
            SC25 · AI Week · GTC · SC24 · also open Blog on the desktop
          </p>
        </header>

        <section className="divide-y divide-[#F6F2EA]/10 border border-[#F6F2EA]/10 rounded-md overflow-hidden">
          {posts.map((post) => (
            <a
              key={post.href}
              href={post.href}
              className="block bg-[#14110D] px-4 py-4 transition hover:bg-[#1A1713] md:px-5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-[15px] font-medium text-[#F6F2EA]">{post.title}</h2>
                <span className="shrink-0 font-mono text-[10px] text-[#F6F2EA]/40">
                  {post.date}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#F6F2EA]/55">
                {post.excerpt}
              </p>
            </a>
          ))}
        </section>
      </div>
    </main>
  )
}
