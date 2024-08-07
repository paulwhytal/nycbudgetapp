import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NYC Budget Planner',
  description: 'Plan your NYC budget with our interactive tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}