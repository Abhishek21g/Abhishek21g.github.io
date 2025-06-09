import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Abhishek Enaguthi',
  description: 'Personal website of Abhishek Enaguthi - Software Engineer specializing in Compilers, GPU Programming, and HPC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="bg-green-500 text-white p-4">If you see a green box, Tailwind is working!</div>
        {children}
      </body>
    </html>
  )
} 