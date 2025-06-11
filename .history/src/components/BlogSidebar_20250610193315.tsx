'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-black/90 backdrop-blur-lg border-r border-white/10 p-6 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Blog</h2>
        <p className="text-gray-400 text-sm">Thoughts on tech, research, and innovation</p>
      </div>

      <nav className="space-y-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={`block group transition-all duration-300 ${
              pathname === `/blog/${post.slug}` ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
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
} 