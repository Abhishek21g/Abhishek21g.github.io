'use client';

import { useVisitorProfile, VisitorProfile } from '../../components/useVisitorProfile'
import GreetingBanner from '../../components/GreetingBanner'
import React from 'react'

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
      greeting: `Welcome to the gallery! Glad to see you from LinkedIn.`
    }
  }
  if (!profile.isReturning) {
    return {
      theme: 'happy',
      greeting: `Welcome to the gallery! Take a look around.`
    }
  }
  if (profile.timeOfDay === 'night') {
    return {
      theme: 'night',
      greeting: `Hey, night owl! Browsing the gallery late?`
    }
  }
  if (profile.interaction === 'energetic') {
    return {
      theme: 'surprise',
      greeting: `Whoa, you're energetic! Enjoy the wild gallery vibe.`
    }
  }
  if (profile.device === 'mobile') {
    return {
      theme: 'chill',
      greeting: `Welcome, mobile explorer! Enjoy the chill gallery.`
    }
  }
  if (profile.isReturning) {
    return {
      theme: 'homecoming',
      greeting: `Welcome back to the gallery! Missed you.`
    }
  }
  return {
    theme: 'happy',
    greeting: `Welcome to the gallery!`
  }
}

export default function GalleryPage() {
  const profile = useVisitorProfile();
  const [remixTheme, setRemixTheme] = React.useState<ThemeKey | null>(null);
  const exp = experienceMap(profile);
  const themeKeys: ThemeKey[] = Object.keys(themeBgMap) as ThemeKey[];
  const theme: ThemeKey = remixTheme || exp.theme;
  const greeting = remixTheme ? 'Remixed! Enjoy a surprise gallery vibe.' : exp.greeting;
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
    <main className={`min-h-screen relative transition-colors duration-500 ${themeBg}`}>
      <GreetingBanner message={greeting} theme={theme} isDark={isDark} />
      <button
        onClick={handleRemix}
        className={`fixed bottom-6 right-6 z-50 ${greetingBg} rounded-full px-4 py-2 shadow-lg hover:opacity-90 transition md:text-base text-sm border ${buttonColor}`}
        aria-label="Remix your gallery experience"
      >
        Remix
      </button>
      <div className={`container mx-auto px-4 py-8 ${textColor}`}>
        <h1 className="text-4xl font-bold mb-8">Gallery</h1>
        {/* Add your gallery content here */}
      </div>
    </main>
  )
} 