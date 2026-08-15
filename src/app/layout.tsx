import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import ThemeProviderWrapper from '../components/ThemeProviderWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Abhishek Enaguthi OS',
  description: 'Interactive desktop portfolio for Abhishek Enaguthi.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
        <Script src="/track.js" strategy="afterInteractive" />
      </body>
    </html>
  )
} 
