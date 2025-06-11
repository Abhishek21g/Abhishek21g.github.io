'use client'

import { useEffect } from 'react'
import BlogSidebar from '@/components/BlogSidebar'
import { useVisitorProfile, VisitorProfile } from '../../../components/useVisitorProfile'
import GreetingBanner from '../../../components/GreetingBanner'
import React from 'react'

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
      Last week during Oregon State University's AI Week, I got to share our work at the new Jen-Hsun Huang & Lori Mills Huang Collaborative Innovation Complex (yeah, it's a mouthful—everyone just calls it the CIC). If you haven't heard, this building is Oregon State University's latest flex: it's packed with next-gen research labs, supercomputing power, and basically sets the standard for how tech buildings should be built.
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

// Theme logic (copy from homepage)
type ThemeKey = 'happy' | 'chill' | 'night' | 'professional' | 'surprise' | 'homecoming';
const themeBgMap: Record<ThemeKey, string> = {
  happy: 'bg-gradient-to-br from-yellow-200 via-yellow-100 to-pink-200',
  chill: 'bg-gradient-to-br from-blue-200 via-cyan-100 to-green-200',
  night: 'bg-gradient-to-br from-black via-gray-900 to-gray-800',
  professional: 'bg-gradient-to-br from-orange-100 via-white to-gray-100',
  surprise: 'bg-gradient-to-br from-fuchsia-200 via-sky-100 to-lime-200',
  homecoming: 'bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100',
}
const themeIsDark: Record<ThemeKey, boolean> = {
  happy: false,
  chill: false,
  night: true,
  professional: false,
  surprise: false,
  homecoming: false,
}
const experienceMap = (profile: VisitorProfile): { theme: ThemeKey; greeting: string } => {
  if (profile.referrer.includes('linkedin')) {
    return {
      theme: 'professional',
      greeting: `Welcome, professional! Glad to see you from LinkedIn.`
    }
  }
  if (!profile.isReturning) {
    return {
      theme: 'happy',
      greeting: `Welcome to Abhishek's blog! Make yourself at home.`
    }
  }
  if (profile.timeOfDay === 'night') {
    return {
      theme: 'night',
      greeting: `Hey, night owl! Reading blogs late?`
    }
  }
  if (profile.interaction === 'energetic') {
    return {
      theme: 'surprise',
      greeting: `Whoa, you're energetic! Enjoy the wild side of the blog.`
    }
  }
  if (profile.device === 'mobile') {
    return {
      theme: 'chill',
      greeting: `Welcome, mobile explorer! Enjoy the chill blog vibe.`
    }
  }
  if (profile.isReturning) {
    return {
      theme: 'homecoming',
      greeting: `Welcome back, Abhishek fan! Missed you.`
    }
  }
  return {
    theme: 'happy',
    greeting: `Welcome to Abhishek's blog!`
  }
}

export default function LightningTalkBlog() {
  const profile = useVisitorProfile();
  const [remixTheme, setRemixTheme] = React.useState<ThemeKey | null>(null);
  const exp = experienceMap(profile);
  const themeKeys: ThemeKey[] = Object.keys(themeBgMap) as ThemeKey[];
  const theme: ThemeKey = remixTheme || exp.theme;
  const greeting = remixTheme ? 'Remixed! Enjoy a surprise blog vibe.' : exp.greeting;
  const themeBg = themeBgMap[theme];
  const isDark = themeIsDark[theme];
  const textColor = isDark ? 'text-white' : 'text-black';
  const buttonColor = isDark ? 'border-white text-white hover:bg-white/10 shadow-black/40' : 'border-black text-black hover:bg-black/10 shadow-white/40';
  const greetingBg = isDark ? 'bg-black/80 text-white' : 'bg-white/80 text-black';

  // Improved remix logic
  const handleRemix = () => {
    let newTheme: ThemeKey;
    do {
      newTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    } while (newTheme === theme);
    setRemixTheme(newTheme);
  };

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
    <main className={`min-h-screen relative transition-colors duration-500 ${themeBg}`}>
      <GreetingBanner message={greeting} theme={theme} isDark={isDark} />
      <button
        onClick={handleRemix}
        className={`fixed bottom-6 right-6 z-50 ${greetingBg} rounded-full px-4 py-2 shadow-lg hover:opacity-90 transition md:text-base text-sm border ${buttonColor}`}
        aria-label="Remix your blog experience"
      >
        Remix
      </button>
      <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
        <BlogSidebar />
        <main className="flex-1 md:ml-80 p-8 md:p-16">
          <article className="max-w-5xl mx-auto">
            <header className="mb-12">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                AI Week at Oregon State University: Digital Twins, The CIC, and Our Omniverse Demo
              </h1>
              <p className="text-lg text-gray-400">April 30, 2025</p>
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
                    Oregon State University CIC
                  </a>
                </li>
              </ul>
            </section>
          </article>
        </main>
      </div>
    </main>
  )
} 