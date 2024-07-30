import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <main className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">NYC Budget Planner</h1>
        <p className="text-xl mb-8">Plan your NYC life with our interactive budget tool</p>
        <Link 
          href="/dashboard" 
          className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300"
        >
          Get Started
        </Link>
      </main>
    </div>
  )
}