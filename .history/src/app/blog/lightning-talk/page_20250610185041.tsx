'use client'

import { useEffect } from 'react'
import BlogSidebar from '@/components/BlogSidebar'

export default function LightningTalkBlog() {
  useEffect(() => {
    // Initialize slide advancement
    let currentPage = 1;
    const totalPages = 20; // Adjust this number based on your actual number of slides
    
    const advanceSlide = () => {
      currentPage = (currentPage % totalPages) + 1;
      const frame = document.getElementById('presentation-frame');
      if (frame) {
        frame.src = `/Blog1/Omniverse_Lightning_Talk.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=${currentPage}`;
      }
    };
    
    const interval = setInterval(advanceSlide, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-black">
      <BlogSidebar />
      
      <main className="flex-1 ml-80 p-12">
        <article className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <header className="space-y-6">
              <h1 className="text-5xl font-bold text-white leading-tight">
                AI Week at OSU: Digital Twins, The CIC, and Our Omniverse Demo
              </h1>
              <p className="text-gray-400">March 20, 2024</p>
            </header>

            <div className="prose prose-invert max-w-none space-y-8">
              <p className="text-xl text-gray-300 leading-relaxed">
                Last week during OSU's AI Week, I got to share our work at the new Jen-Hsun Huang & Lori Mills Huang Collaborative Innovation Complex (yeah, it's a mouthful—everyone just calls it the CIC). If you haven't heard, this building is OSU's latest flex: it's packed with next-gen research labs, supercomputing power, and basically sets the standard for how tech buildings should be built.
              </p>

              <p className="text-xl text-gray-300 leading-relaxed">
                Our project? We're building a digital twin of the CIC's main server room using NVIDIA Omniverse. That means we're making a full virtual replica—down to the racks, sensors, and sliding doors—that can simulate everything from airflow to security to how people interact with the space.
              </p>

              <p className="text-xl text-gray-300 leading-relaxed">
                It's not just for show. With this setup, we can test layouts, run AI-powered cooling simulations, and find ways to make the whole place more efficient (and way less chaotic) before anyone touches real hardware.
              </p>

              <p className="text-xl text-gray-300 leading-relaxed">
                At AI Week, I gave a quick lightning talk about how we made all this happen—and showed off our Omniverse poster. The crowd favorite? The smart sliding door. I scripted it to open on its own if you walk up, and for some reason, everyone thought that was the coolest thing ever.
              </p>

              <p className="text-xl text-gray-300 leading-relaxed">
                This project is about making campus tech smarter and more future-proof, and honestly, it's just getting started. Stay tuned.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                '/Blog1/IMG_4170.jpeg',
                '/Blog1/IMG_4171.jpeg',
                '/Blog1/IMG_7984.jpg',
                '/Blog1/IMG_8855.jpg',
                '/Blog1/IMG_1111.jpg',
              ].map((src, index) => (
                <div key={index} className="relative group overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-80 object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black/50 backdrop-blur-sm">
              <iframe
                src="/Blog1/Omniverse_Lightning_Talk.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1"
                width="100%"
                height="700px"
                className="border-0"
                id="presentation-frame"
              />
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black/50 backdrop-blur-sm">
              <video
                controls
                className="w-full"
              >
                <source src="/Blog1/Project X.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white">Key Takeaways</h2>
              <ul className="space-y-4">
                <li className="text-xl text-gray-300">Digital twin technology is revolutionizing how we plan and optimize server room infrastructure</li>
                <li className="text-xl text-gray-300">NVIDIA Omniverse provides powerful tools for creating interactive, physics-accurate simulations</li>
                <li className="text-xl text-gray-300">The CIC represents a new standard in research facility design and capabilities</li>
                <li className="text-xl text-gray-300">Smart automation features, like the interactive sliding door, demonstrate the practical applications of digital twin technology</li>
              </ul>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-white">Resources</h2>
              <ul className="space-y-4">
                <li>
                  <a href="/Blog1/Omniverse_Lightning_Talk.pdf" className="text-xl text-blue-400 hover:text-blue-300 transition-colors">
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
            </div>
          </div>
        </article>
      </main>
    </div>
  )
} 