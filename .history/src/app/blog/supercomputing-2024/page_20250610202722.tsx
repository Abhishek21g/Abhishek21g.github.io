'use client'

import BlogSidebar from '@/components/BlogSidebar'
import { useVisitorProfile, VisitorProfile } from '../../../components/useVisitorProfile'
import GreetingBanner from '../../../components/GreetingBanner'
import React from 'react'

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
      This was our first time in ATL, where we took our CIC digital twin project to Supercomputing 2024 (SC24). It was insane—think thousands of researchers, engineers, and tech nerds from all over the world, all geeking out over the latest in supercomputing, AI, and data centers.
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

export default function Supercomputing2024Blog() {
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <GreetingBanner message={greeting} theme={theme} isDark={isDark} />
      <button
        onClick={handleRemix}
        className={`fixed bottom-6 right-6 z-50 ${greetingBg} rounded-full px-4 py-2 shadow-lg hover:opacity-90 transition md:text-base text-sm border ${buttonColor}`}
        aria-label="Remix your blog experience"
      >
        Remix
      </button>
      <BlogSidebar />
      <main className="flex-1 md:ml-80 p-8 md:p-16">
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
                    className="w-full h-80 object-contain object-center bg-black transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110 will-change-transform will-change-filter"
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