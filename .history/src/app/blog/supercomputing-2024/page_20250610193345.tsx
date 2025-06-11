'use client'

import BlogSidebar from '@/components/BlogSidebar'

const galleryImages = [
  '/blog2/6067EE10-FF09-4E2C-BDC9-8B4712056532 2.JPG',
  '/blog2/IMG_7595 2.jpg',
  '/blog2/IMG_7596 2.jpg',
  '/blog2/IMG_7597 2.jpg',
  '/blog2/IMG_4816.jpg',
  '/blog2/IMG_6506.jpg',
  '/blog2/IMG_6509.jpg',
  '/blog2/IMG_6755 2.jpg',
  '/blog2/IMG_6914 2.jpg',
  '/blog2/IMG_6937.jpg',
  '/blog2/IMG_7034.jpg',
]

const blogText = (
  <section className="mb-16 prose prose-invert max-w-none text-xl text-gray-300 space-y-6">
    <p>
      Just got back from Atlanta, where we took our CIC digital twin project to Supercomputing 2024 (SC24). It was insane—think thousands of researchers, engineers, and tech nerds from all over the world, all geeking out over the latest in supercomputing, AI, and data centers.
    </p>
    <p>
      We were there to represent Oregon State and show off the digital twin we built for the Jen-Hsun Huang & Lori Mills Huang Collaborative Innovation Complex (CIC). Our project was on display at the Link Oregon booth, marking OSU's first time ever at this conference. Big deal.
    </p>
    <p>
      <strong>What did we show?</strong><br/>
      A full simulation of the CIC's data center—live in NVIDIA Omniverse. Visitors could see how we're using real sensor data, running heat maps, testing out server rack layouts, and even demoing our (now legendary) smart sliding door that opens itself. People from industry, academia, and even folks from NVIDIA dropped by, asked questions, and honestly, it felt good seeing how much interest there is in making data centers smarter.
    </p>
    <p>
      <strong>The trip itself?</strong><br/>
      Not gonna lie—it was exhausting and awesome at the same time. Early mornings, long days at the booth, and late-night tech talks with people way smarter than me. We got to network with leaders from NVIDIA, Dell, Google, and more. Plus, Atlanta food did not disappoint.
    </p>
    <p>
      <strong>Why does this matter?</strong><br/>
      This trip put OSU on the map for AI and high-performance computing. Our project isn't just academic; it's showing real-world impact, and the fact that we were invited to present means we're actually making noise in the field.
    </p>
    <p>
      Already hyped for next year. Until then, it's back to the grind.
    </p>
  </section>
)

export default function Supercomputing2024Blog() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <BlogSidebar />
      <main className="flex-1 ml-80 p-8 md:p-16">
        <article className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              Repping OSU at Supercomputing 2024: CIC Digital Twin Goes National
            </h1>
            <p className="text-lg text-gray-400">November 2024</p>
          </header>

          {blogText}

          <section className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {galleryImages.map((src, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 group relative cursor-zoom-in transition-transform duration-500 hover:scale-105 hover:shadow-2xl will-change-transform"
                  style={{ transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.5s cubic-bezier(0.4,0,0.2,1)' }}
                >
                  <img
                    src={src}
                    alt={''}
                    className="w-full h-80 object-cover object-center transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110 will-change-transform will-change-filter"
                    style={{ display: 'block', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), filter 0.5s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  )
} 