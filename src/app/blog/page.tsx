'use client'

import Image from 'next/image'
import Link from 'next/link'
import Starfield from '../../components/Starfield'

const posts = [
  {
    slug: 'skydiving-adventure',
    title: 'Skydiving Adventure',
    excerpt: 'Jumped out of a plane. 10/10 would recommend. Read for the full adrenaline rush.',
    date: 'March 2024',
    image: '/images/skydiving.jpg',
  },
  {
    slug: 'sc24-experience',
    title: 'Supercomputing Conference 2024',
    excerpt: 'Represented OSU at SC24, presenting our digital twin project and connecting with global leaders in HPC and AI.',
    date: 'November 2024',
    image: '/images/IMG_9530.JPG',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black relative">
      <Starfield />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-10 text-center text-white">Blog</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map(post => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`} 
                className="block rounded-xl overflow-hidden bg-black/50 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="relative h-56">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-gray-400 text-sm mb-2">{post.date}</div>
                  <h2 className="text-2xl font-semibold mb-2 text-white">{post.title}</h2>
                  <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  <span className="text-blue-400 font-medium hover:text-blue-300 transition-colors">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 