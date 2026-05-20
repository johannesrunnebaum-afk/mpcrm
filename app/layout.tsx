import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import TopBarWrapper from '@/components/TopBarWrapper'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mpilot CRM',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={dmSans.className} style={{ margin: 0, height: '100vh', overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            <TopBarWrapper />
            <main style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
              {/* Ambient glow spots in the content area */}
              <div style={{ position: 'fixed', top: '10%', right: '15%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
              <div style={{ position: 'fixed', bottom: '5%', right: '5%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
