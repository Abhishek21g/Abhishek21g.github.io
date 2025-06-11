import { useEffect, useState } from 'react';

export type VisitorProfile = {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  device: 'mobile' | 'desktop';
  referrer: string;
  language: string;
  isReturning: boolean;
  interaction: 'calm' | 'energetic' | 'normal';
};

export function useVisitorProfile() {
  const [profile, setProfile] = useState<VisitorProfile>({
    timeOfDay: 'morning',
    device: 'desktop',
    referrer: '',
    language: 'en',
    isReturning: false,
    interaction: 'normal',
  });

  useEffect(() => {
    // Time of day
    const hour = new Date().getHours();
    let timeOfDay: VisitorProfile['timeOfDay'] = 'morning';
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
    else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Device
    const device = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

    // Referrer
    const referrer = document.referrer || '';

    // Language
    const language = navigator.language || 'en';

    // First-time/returning
    let isReturning = false;
    try {
      if (window.localStorage.getItem('hasVisited')) {
        isReturning = true;
      } else {
        window.localStorage.setItem('hasVisited', 'true');
      }
    } catch {}

    // Interaction style
    let interaction: VisitorProfile['interaction'] = 'normal';
    let lastScroll = 0;
    let lastClick = 0;
    let scrolls = 0;
    let clicks = 0;
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScroll < 500) scrolls++;
      lastScroll = now;
      if (scrolls > 10) interaction = 'energetic';
    };
    const handleClick = () => {
      const now = Date.now();
      if (now - lastClick < 500) clicks++;
      lastClick = now;
      if (clicks > 10) interaction = 'energetic';
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);
    // After 5s, decide if calm/energetic
    setTimeout(() => {
      if (scrolls < 2 && clicks < 2) interaction = 'calm';
      setProfile({
        timeOfDay,
        device,
        referrer,
        language,
        isReturning,
        interaction,
      });
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    }, 5000);
    // Initial set
    setProfile((p) => ({ ...p, timeOfDay, device, referrer, language, isReturning }));
  }, []);

  return profile;
} 