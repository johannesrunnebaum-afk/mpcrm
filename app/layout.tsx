import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <TopBar />
            <main style={{ flex: 1, overflow: 'auto', background: '#F2F2F2' }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
