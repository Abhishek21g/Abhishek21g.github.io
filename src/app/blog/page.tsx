const posts = [
  {
    date: 'April 2025',
    excerpt:
      'A lightning talk on the CIC server-room digital twin, NVIDIA Omniverse, and making infrastructure visible.',
    href: '/blog/lightning-talk/',
    title: 'Digital Twins, the CIC, and Our Omniverse Demo',
  },
  {
    date: 'November 2024',
    excerpt:
      'Taking OSU digital twin work to SC24 in Atlanta, with live sensor data, rack-layout tests, and HPC conversations.',
    href: '/blog/supercomputing-2024/',
    title: 'Repping OSU at Supercomputing 2024',
  },
]

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-[#14110D] px-5 py-6 text-[#F6F2EA] md:px-8">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-8 flex items-center justify-between font-mono text-xs text-[#F6F2EA]/55">
          <a href="/" className="text-[#E2621B] hover:text-[#ff7a32]">
            AE desktop
          </a>
          <span>Blog.app</span>
        </nav>

        <header className="mb-8">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#E2621B]">
            Field notes
          </p>
          <h1 className="font-serif text-5xl font-normal leading-none md:text-7xl">
            Blog
          </h1>
        </header>

        <section className="overflow-hidden rounded-[10px] border border-[#F6F2EA]/10 bg-[#F6F2EA] text-[#14110D]">
          <div className="flex h-9 items-center gap-2 border-b border-[#14110D]/10 bg-[#EDEAE2] px-4">
            <span className="h-[11px] w-[11px] rounded-full bg-[#E2621B]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#14110D]/15" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#14110D]/15" />
          </div>
          <div className="divide-y divide-[#14110D]/10">
            {posts.map((post) => (
              <a
                key={post.href}
                href={post.href}
                className="block p-5 transition hover:bg-[#EDEAE2] md:p-7"
              >
                <div className="mb-2 font-mono text-[11px] text-[#E2621B]">
                  {post.date}
                </div>
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5B5648]">
                  {post.excerpt}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
