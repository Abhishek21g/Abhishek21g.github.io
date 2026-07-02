'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const blogPosts = [
  {
    title: "AI Week at Oregon State University: Digital Twins, The CIC, and Our Omniverse Demo",
    date: "April 30, 2025",
    slug: "lightning-talk",
    excerpt: "Exploring digital twin technology and NVIDIA Omniverse at Oregon State University's AI Week..."
  },
  {
    title: "Repping OSU at Supercomputing 2024: CIC Digital Twin Goes National",
    date: "November 2024",
    slug: "supercomputing-2024",
    excerpt: "Taking the CIC digital twin project to Atlanta for Supercomputing 2024 (SC24)..."
  }
]

export default function BlogSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Sidebar content as a component for reuse
  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Blog</h2>
        <p className="text-gray-400 text-sm">Thoughts on tech, research, and innovation</p>
      </div>
      <nav className="space-y-6 flex-1">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={`block group transition-all duration-300 ${
              pathname === `/blog/${post.slug}` ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
            onClick={() => setOpen(false)}
          >
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-400">{post.date}</p>
              <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black/80 rounded-full p-2 border border-white/10 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Open blog navigation"
        onClick={() => setOpen(true)}
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-80 md:bg-black/90 md:backdrop-blur-lg md:border-r md:border-white/10 md:p-6 md:overflow-y-auto md:block z-40">
        {sidebarContent}
      </div>

      {/* Slide-in sidebar for mobile */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
            onClick={() => setOpen(false)}
            aria-label="Close blog navigation overlay"
          />
          {/* Drawer */}
          <aside
            className="fixed left-0 top-0 h-full w-4/5 max-w-xs bg-black/95 backdrop-blur-lg border-r border-white/10 p-6 z-50 shadow-2xl transition-transform duration-300 transform translate-x-0"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Close blog navigation"
              onClick={() => setOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
} 