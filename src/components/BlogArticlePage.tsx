type BlogArticlePageProps = {
  date: string
  hero: string
  kicker: string
  media?: Array<{ alt: string; src: string }>
  paragraphs: string[]
  title: string
}

export default function BlogArticlePage({
  date,
  hero,
  kicker,
  media = [],
  paragraphs,
  title,
}: BlogArticlePageProps) {
  return (
    <main className="min-h-screen bg-[#14110D] text-[#F6F2EA]">
      <div className="mx-auto max-w-5xl px-5 py-5 md:px-8 md:py-8">
        <nav className="mb-6 flex items-center justify-between font-mono text-xs text-[#F6F2EA]/55">
          <a href="/" className="text-[#E2621B] hover:text-[#ff7a32]">
            AE desktop
          </a>
          <span>{date}</span>
        </nav>

        <article className="overflow-hidden rounded-[10px] border border-[#F6F2EA]/10 bg-[#F6F2EA] text-[#14110D] shadow-2xl">
          <div className="flex h-9 items-center gap-2 border-b border-[#14110D]/10 bg-[#EDEAE2] px-4">
            <span className="h-[11px] w-[11px] rounded-full bg-[#E2621B]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#14110D]/15" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#14110D]/15" />
            <span className="ml-auto mr-auto font-mono text-[11px] text-[#5B5648]">
              Blog.readme
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 md:p-10">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#E2621B]">
                {kicker}
              </p>
              <h1 className="font-serif text-4xl font-normal leading-[0.98] md:text-6xl">
                {title}
              </h1>
              <div className="mt-8 space-y-5 text-base leading-8 text-[#3B3529]">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="bg-[#14110D] p-3">
              <img
                src={hero}
                alt=""
                className="h-[360px] w-full rounded-md object-contain md:h-full"
              />
            </div>
          </div>
        </article>

        {media.length > 0 ? (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((item) => (
              <figure
                key={item.src}
                className="rounded-[10px] border border-[#F6F2EA]/10 bg-[#F6F2EA]/5 p-2"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-64 w-full rounded-md bg-black object-contain"
                />
                <figcaption className="mt-2 font-mono text-[11px] text-[#F6F2EA]/50">
                  {item.alt}
                </figcaption>
              </figure>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  )
}
