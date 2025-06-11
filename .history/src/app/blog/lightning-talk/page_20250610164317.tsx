'use client'

import { useEffect } from 'react'

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
    <main className="min-h-screen bg-black text-white p-8">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">AI Week at OSU: Digital Twins, The CIC, and Our Omniverse Demo</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-6">
            Last week during OSU's AI Week, I got to share our work at the new Jen-Hsun Huang & Lori Mills Huang Collaborative Innovation Complex (yeah, it's a mouthful—everyone just calls it the CIC). If you haven't heard, this building is OSU's latest flex: it's packed with next-gen research labs, supercomputing power, and basically sets the standard for how tech buildings should be built.
          </p>

          <p className="text-lg mb-6">
            Our project? We're building a digital twin of the CIC's main server room using NVIDIA Omniverse. That means we're making a full virtual replica—down to the racks, sensors, and sliding doors—that can simulate everything from airflow to security to how people interact with the space.
          </p>

          <p className="text-lg mb-6">
            It's not just for show. With this setup, we can test layouts, run AI-powered cooling simulations, and find ways to make the whole place more efficient (and way less chaotic) before anyone touches real hardware.
          </p>

          <p className="text-lg mb-6">
            At AI Week, I gave a quick lightning talk about how we made all this happen—and showed off our Omniverse poster. The crowd favorite? The smart sliding door. I scripted it to open on its own if you walk up, and for some reason, everyone thought that was the coolest thing ever.
          </p>

          <p className="text-lg mb-12">
            This project is about making campus tech smarter and more future-proof, and honestly, it's just getting started. Stay tuned.
          </p>

          <h2 className="text-3xl font-bold mb-8">Event Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { src: '/Blog1/IMG_4170.jpeg', alt: 'AI Week Presentation', caption: 'AI Week Presentation' },
              { src: '/Blog1/IMG_4171.jpeg', alt: 'CIC Server Room', caption: 'CIC Server Room' },
              { src: '/Blog1/IMG_7984.jpg', alt: 'Digital Twin Demo', caption: 'Digital Twin Demo' },
              { src: '/Blog1/IMG_8855.jpg', alt: 'Omniverse Setup', caption: 'Omniverse Setup' },
              { src: '/Blog1/IMG_1111.jpg', alt: 'AI Week Event', caption: 'AI Week Event' },
            ].map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 text-sm">
                  {image.caption}
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-8">Presentation</h2>
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="/Blog1/Omniverse_Lightning_Talk.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1"
              width="100%"
              height="600px"
              className="border-0"
              id="presentation-frame"
            />
          </div>

          <h2 className="text-3xl font-bold mb-8">Project Demo Video</h2>
          <div className="mb-12 max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg">
            <video
              controls
              className="w-full"
            >
              <source src="/Blog1/Project X.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <h2 className="text-3xl font-bold mb-8">Key Takeaways</h2>
          <ul className="list-disc list-inside space-y-4 mb-12">
            <li>Digital twin technology is revolutionizing how we plan and optimize server room infrastructure</li>
            <li>NVIDIA Omniverse provides powerful tools for creating interactive, physics-accurate simulations</li>
            <li>The CIC represents a new standard in research facility design and capabilities</li>
            <li>Smart automation features, like the interactive sliding door, demonstrate the practical applications of digital twin technology</li>
          </ul>

          <h2 className="text-3xl font-bold mb-8">Resources</h2>
          <ul className="space-y-4 mb-12">
            <li>
              <a href="/Blog1/Omniverse_Lightning_Talk.pdf" className="text-blue-400 hover:text-blue-300">
                Presentation PDF
              </a>
            </li>
            <li>
              <a href="https://www.nvidia.com/en-us/omniverse/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                NVIDIA Omniverse
              </a>
            </li>
            <li>
              <a href="https://cic.oregonstate.edu/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                OSU CIC
              </a>
            </li>
          </ul>
        </div>
      </article>
    </main>
  )
} 