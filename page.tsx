'use client'

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">
      
      <nav className="flex items-center justify-between mb-20">
        <h1 className="text-2xl font-bold">
          Syncra AI
        </h1>

        <button className="bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold">
          Join Waitlist
        </button>
      </nav>

      <section className="max-w-5xl mx-auto text-center">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-bold leading-tight"
        >
          Never lose a customer again.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-gray-400 text-lg max-w-2xl mx-auto"
        >
          AI-powered sales assistant for WhatsApp and Instagram businesses in Africa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold">
            Start Free Trial
          </button>

          <button className="border border-gray-700 px-6 py-3 rounded-full">
            Watch Demo
          </button>
        </motion.div>

      </section>

    </main>
  )
}