import React, { useEffect, useState } from 'react';

interface GreetingBannerProps {
  message: string;
  theme: string;
  isDark: boolean;
}

export default function GreetingBanner({ message, theme, isDark }: GreetingBannerProps) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [message, theme]);

  const greetingBg = isDark ? 'bg-black/80 text-white' : 'bg-white/80 text-black';

  return (
    <>
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 ${greetingBg} rounded-full px-6 py-3 shadow-lg text-lg font-semibold backdrop-blur-md max-w-[90vw] text-center md:text-lg text-sm transition-all duration-500 ${mounted && visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        style={{ maxWidth: '90vw' }}
        aria-live="polite"
      >
        {message}
        <button
          className="ml-4 text-xs underline opacity-60 hover:opacity-100"
          onClick={() => setVisible(false)}
          aria-label="Hide greeting"
        >
          Hide
        </button>
      </div>
      {!visible && (
        <button
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 ${greetingBg} rounded-full px-2 py-1 shadow-md text-xs font-semibold opacity-80 hover:opacity-100 transition-all`}
          style={{ maxWidth: '90vw' }}
          onClick={() => setVisible(true)}
          aria-label="Show greeting"
        >
          Show greeting
        </button>
      )}
    </>
  );
} 