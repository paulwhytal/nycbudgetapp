import Link from 'next/link'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <nav className="p-4 bg-gray-900">
          <ul className="flex space-x-4 justify-center">
            <li>
              <Link href="/" className="hover:text-gray-300">Home</Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            </li>
            <li>
              <Link href="/budget" className="hover:text-gray-300">Budget</Link>
            </li>
            <li>
              <Link href="/projections" className="hover:text-gray-300">Projections</Link>
            </li>
            <li>
              <Link href="/calculators" className="hover:text-gray-300">Calculators</Link>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  )
}