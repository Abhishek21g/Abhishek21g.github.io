'use client'

import Image from 'next/image'
import Link from 'next/link'
import Navigation from '../components/Navigation'
import Projects from '../components/Projects'
import Starfield from '../components/Starfield'
import { useVisitorProfile } from '../components/useVisitorProfile'
import React from 'react'

const experienceMap = (profile) => {
  // Map profile to theme and greeting
  if (profile.referrer.includes('linkedin')) {
    return {
      theme: 'professional',
      greeting: `Welcome, professional! Glad to see you from LinkedIn.`
    }
  }
  if (!profile.isReturning) {
    return {
      theme: 'happy',
      greeting: `Welcome to Abhishek's site! Make yourself at home.`
    }
  }
  if (profile.timeOfDay === 'night') {
    return {
      theme: 'night',
      greeting: `Hey, night owl! Burning the midnight oil?`
    }
  }
  if (profile.interaction === 'energetic') {
    return {
      theme: 'surprise',
      greeting: `Whoa, you're energetic! Enjoy the wild side of the site.`
    }
  }
  if (profile.device === 'mobile') {
    return {
      theme: 'chill',
      greeting: `Welcome, mobile explorer! Enjoy the chill vibe.`
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
    greeting: `Welcome to Abhishek's site!`
  }
}

const themeBgMap = {
  happy: 'bg-gradient-to-br from-yellow-200 via-yellow-100 to-pink-200',
  chill: 'bg-gradient-to-br from-blue-200 via-cyan-100 to-green-200',
  night: 'bg-gradient-to-br from-black via-gray-900 to-gray-800',
  professional: 'bg-gradient-to-br from-orange-100 via-white to-gray-100',
  surprise: 'bg-gradient-to-br from-fuchsia-200 via-sky-100 to-lime-200',
  homecoming: 'bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100',
}

export default function Home() {
  const profile = useVisitorProfile();
  const [remix, setRemix] = React.useState(0);
  const exp = experienceMap(profile);
  // If remixed, randomize theme and greeting
  const theme = remix ? Object.keys(themeBgMap)[Math.floor(Math.random()*Object.keys(themeBgMap).length)] : exp.theme;
  const greeting = remix ? 'Remixed! Enjoy a surprise vibe.' : exp.greeting;
  const themeBg = themeBgMap[theme];

  return (
    <main className={`min-h-screen relative transition-colors duration-500 ${themeBg}`}>
      {/* Dynamic greeting */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white rounded-full px-6 py-3 shadow-lg text-lg font-semibold backdrop-blur-md">
        {greeting}
      </div>
      {/* Remix button */}
      <button
        onClick={() => setRemix((r) => r+1)}
        className="fixed bottom-6 right-6 z-50 bg-black/80 text-white rounded-full px-4 py-2 shadow-lg hover:bg-black/90 transition md:text-base text-sm"
        aria-label="Remix your experience"
      >
        Remix
      </button>
      <Starfield />
      <Navigation />
      
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center py-16 md:py-32 px-4 md:px-0 fade-in relative z-10">
        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          <Image
            src={require("../assets/images/oracle image .jpeg").default}
            alt="Abhishek Enaguthi at Oracle"
            width={400}
            height={400}
            className="rounded-full shadow-lg object-cover"
            priority
          />
        </div>
        <div className={`w-full md:w-1/2 text-center md:text-left ${theme === 'night' ? 'text-white' : 'text-black'}`}>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Software Engineer specializing in Compilers, GPU Programming, and HPC</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">Abhishek Enaguthi</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <Link href="/gallery" className="px-6 py-3 border border-white text-white rounded-full font-semibold hover:bg-white/10 transition">View Gallery</Link>
            <a 
              href="/resume.pdf"
              download
              className="px-6 py-3 border border-white text-white rounded-full font-semibold hover:bg-white/10 transition"
            >
              Download Resume
            </a>
            <Link 
              href="/blog/supercomputing-2024"
              className="px-6 py-3 border border-white text-white rounded-full font-semibold hover:bg-white/10 transition"
            >
              Blog
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-transparent relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-white">About Me</h2>
          <div className="max-w-3xl mx-auto text-lg text-gray-300">
            <p className="mb-6">
              I'm a Computer Science student at Oregon State University with a passion for low-level systems,
              compilers, and high-performance computing. Currently pursuing my Bachelor's degree with a 3.95 GPA,
              I'm actively working on cutting-edge projects in AI systems and compiler technology.
            </p>
            <p className="mb-6">
              My experience spans from AI Systems Software Research to CRM Development, with a strong focus on
              performance optimization and innovative solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-transparent relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-white">Experience</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-black/50 p-8 rounded-2xl shadow-sm border border-white/10">
              <h3 className="text-2xl font-semibold mb-4 text-white">AI Systems Software Intern</h3>
              <p className="text-gray-300 mb-4">College of Earth Science at OSU</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Presented digital twin project at Supercomputing 24</li>
                <li>Developed NVIDIA Omniverse automation for HPC optimization</li>
                <li>Authored work on compiler technology for IBM POWER9 and AMD ROCm</li>
              </ul>
            </div>
            <div className="bg-black/50 p-8 rounded-2xl shadow-sm border border-white/10">
              <h3 className="text-2xl font-semibold mb-4 text-white">Salesforce Lead CRM Developer</h3>
              <p className="text-gray-300 mb-4">Oregon State University</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Implemented CI/CD pipelines reducing resolution time by 50%</li>
                <li>Developed Salesforce CRM components using Apex and JavaScript</li>
                <li>Led development achieving 90% reduction in user-reported issues</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <Projects />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-transparent relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-white">Get in Touch</h2>
          <div className="flex justify-center gap-8">
            <a 
              href="mailto:enaguthiabhishek@gmail.com"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Email
            </a>
            <a 
              href="https://linkedin.com/in/abhishekenaguthi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/Abhishek21g"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  )
} 