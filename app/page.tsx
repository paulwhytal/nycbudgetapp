import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <main className="text-center">
        <h1 className="text-5xl font-bold mb-6">NYC Budget Planner</h1>
        <p className="text-xl mb-10 max-w-md mx-auto">
          Simplify your New York City budget planning with our intuitive tool.
        </p>
        <Link 
          href="/dashboard" 
          className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300"
        >
          Start Planning
        </Link>
      </main>
    </div>
  )
}
