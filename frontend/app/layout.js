// app/layout.js
import './globals.css'
import Nav from '@/components/Nav'

export const metadata = {
  title: 'RoomieAI - Shared Living Assistant',
  description: 'AI-powered shared living management for students and roommates',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-surface-0 text-text-1 min-h-screen">
        <Nav />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}