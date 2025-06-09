'use client'

import { useState } from 'react'

const projects = [
  {
    title: 'Tesla Video Q&A Challenge',
    description: 'Built a Vision-Language Model pipeline using DETR and Gemini for real-time video analysis.',
    technologies: ['Python', 'DETR', 'Gemini', 'NVIDIA H100'],
    highlights: [
      '70% accuracy on 50 test videos',
      'Real-time context-aware responses',
      'Optimized inference with parallel processing'
    ]
  },
  {
    title: 'Custom Compiler Development',
    description: 'Developed a custom compiler with LLVM backend for optimized machine instructions.',
    technologies: ['LLVM', 'C++', 'Rust', 'Assembly', 'Flex', 'Bison'],
    highlights: [
      'Graph-based register allocator',
      '30% improved memory efficiency',
      'Advanced optimizations including constant folding'
    ]
  }
]

export default function Projects() {
  const [activeProject, setActiveProject] = useState(0)

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Project Navigation */}
            <div className="space-y-4">
              {projects.map((project, index) => (
                <button
                  key={index}
                  onClick={() => setActiveProject(index)}
                  className={`w-full text-left p-6 rounded-xl transition-all ${
                    activeProject === index
                      ? 'bg-black text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm opacity-80">{project.description}</p>
                </button>
              ))}
            </div>

            {/* Project Details */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">
                    {projects[activeProject].title}
                  </h3>
                  <p className="text-gray-700">
                    {projects[activeProject].description}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {projects[activeProject].technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-black text-white rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Key Highlights</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {projects[activeProject].highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 