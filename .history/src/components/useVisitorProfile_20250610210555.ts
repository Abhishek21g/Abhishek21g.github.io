import { useEffect, useState } from 'react';

export type VisitorProfile = {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  device: 'mobile' | 'desktop';
  referrer: string;
  language: string;
  isReturning: boolean;
  interaction: 'calm' | 'energetic' | 'normal';
  location?: {
    city?: string;
    country?: string;
  };
};

export function useVisitorProfile() {
  const [profile, setProfile] = useState<VisitorProfile>({
    timeOfDay: 'morning',
    device: 'desktop',
    referrer: '',
    language: 'en',
    isReturning: false,
    interaction: 'normal',
    location: undefined,
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

    // Returning visitor
    let isReturning = false;
    try {
      isReturning = !!localStorage.getItem('visited');
      localStorage.setItem('visited', 'true');
    } catch {}

    // Interaction style (default to normal)
    let interaction: VisitorProfile['interaction'] = 'normal';

    setProfile((prev) => ({
      ...prev,
      timeOfDay,
      device,
      referrer,
      language,
      isReturning,
      interaction,
    }));

    // Geolocation (ipinfo.io, free, privacy-respecting)
    fetch('https://ipinfo.io/json?token=demo')
      .then((res) => res.json())
      .then((data) => {
        setProfile((prev) => ({
          ...prev,
          location: {
            city: data.city,
            country: data.country,
          },
        }));
      })
      .catch(() => {});
  }, []);

  // Track interaction style (energetic/calm)
  useEffect(() => {
    let lastScroll = window.scrollY;
    let lastTime = Date.now();
    let energetic = false;
    const handleScroll = () => {
      const now = Date.now();
      const delta = Math.abs(window.scrollY - lastScroll);
      if (delta > 100 && now - lastTime < 300) energetic = true;
      lastScroll = window.scrollY;
      lastTime = now;
      setProfile((prev) => ({ ...prev, interaction: energetic ? 'energetic' : 'normal' }));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return profile;
} 