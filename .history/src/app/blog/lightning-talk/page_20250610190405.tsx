'use client'

import { useEffect } from 'react'
import BlogSidebar from '@/components/BlogSidebar'

const galleryImages = [
  '/Blog1/IMG_4170.jpeg',
  '/Blog1/IMG_4171.jpeg',
  '/Blog1/IMG_7984.jpg',
  '/Blog1/IMG_8855.jpg',
  '/Blog1/IMG_1111.jpg',
]

const blogText = (
  <section className="mb-16 prose prose-invert max-w-none text-xl text-gray-300 space-y-6">
    <p>
      Last week during OSU's AI Week, I got to share our work at the new Jen-Hsun Huang & Lori Mills Huang Collaborative Innovation Complex (yeah, it's a mouthful—everyone just calls it the CIC). If you haven't heard, this building is OSU's latest flex: it's packed with next-gen research labs, supercomputing power, and basically sets the standard for how tech buildings should be built.
    </p>
    <p>
      Our project? We're building a digital twin of the CIC's main server room using NVIDIA Omniverse. That means we're making a full virtual replica—down to the racks, sensors, and sliding doors—that can simulate everything from airflow to security to how people interact with the space.
    </p>
    <p>
      It's not just for show. With this setup, we can test layouts, run AI-powered cooling simulations, and find ways to make the whole place more efficient (and way less chaotic) before anyone touches real hardware.
    </p>
    <p>
      At AI Week, I gave a quick lightning talk about how we made all this happen—and showed off our Omniverse poster. The crowd favorite? The smart sliding door. I scripted it to open on its own if you walk up, and for some reason, everyone thought that was the coolest thing ever.
    </p>
    <p>
      This project is about making campus tech smarter and more future-proof, and honestly, it's just getting started. Stay tuned.
    </p>
  </section>
)

export default function LightningTalkBlog() {
  useEffect(() => {
    let currentPage = 1;
    const totalPages = 20;
    const advanceSlide = () => {
      currentPage = (currentPage % totalPages) + 1;
      const frame = document.getElementById('presentation-frame') as HTMLIFrameElement | null;
      if (frame) {
        frame.src = `/Blog1/Omniverse-Talk-AIWeek-2025 (1).pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=${currentPage}`;
      }
    };
    const interval = setInterval(advanceSlide, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <BlogSidebar />
      <main className="flex-1 ml-80 p-8 md:p-16">
        <article className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              AI Week at OSU: Digital Twins, The CIC, and Our Omniverse Demo
            </h1>
            <p className="text-lg text-gray-400">March 20, 2024</p>
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
                    className={`w-full h-80 object-cover object-center transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110 will-change-transform will-change-filter${src.includes('IMG_8855') ? ' object-[center_top] scale-110' : ''}`}
                    style={src.includes('IMG_8855') ? { objectPosition: 'center top', transform: 'scale(1.1)', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), filter 0.5s cubic-bezier(0.4,0,0.2,1)' } : { display: 'block', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), filter 0.5s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16 rounded-3xl overflow-hidden shadow-2xl bg-black/60 backdrop-blur-md">
            <iframe
              src="/Blog1/Omniverse-Talk-AIWeek-2025 (1).pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1"
              width="100%"
              height="700px"
              className="border-0"
              id="presentation-frame"
            />
          </section>

          <section className="mb-16 rounded-3xl overflow-hidden shadow-2xl bg-black/60 backdrop-blur-md">
            <video
              controls
              className="w-full"
            >
              <source src="/Blog1/Project X.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Key Takeaways</h2>
            <ul className="space-y-4">
              <li className="text-xl text-gray-300">Digital twin technology is revolutionizing how we plan and optimize server room infrastructure</li>
              <li className="text-xl text-gray-300">NVIDIA Omniverse provides powerful tools for creating interactive, physics-accurate simulations</li>
              <li className="text-xl text-gray-300">The CIC represents a new standard in research facility design and capabilities</li>
              <li className="text-xl text-gray-300">Smart automation features, like the interactive sliding door, demonstrate the practical applications of digital twin technology</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Resources</h2>
            <ul className="space-y-4">
              <li>
                <a href="/Blog1/Omniverse-Talk-AIWeek-2025 (1).pdf" className="text-xl text-blue-400 hover:text-blue-300 transition-colors">
                  Presentation PDF
                </a>
              </li>
              <li>
                <a href="https://www.nvidia.com/en-us/omniverse/" target="_blank" rel="noopener noreferrer" className="text-xl text-blue-400 hover:text-blue-300 transition-colors">
                  NVIDIA Omniverse
                </a>
              </li>
              <li>
                <a href="https://cic.oregonstate.edu/" target="_blank" rel="noopener noreferrer" className="text-xl text-blue-400 hover:text-blue-300 transition-colors">
                  OSU CIC
                </a>
              </li>
            </ul>
          </section>
        </article>
      </main>
    </div>
  )
} 