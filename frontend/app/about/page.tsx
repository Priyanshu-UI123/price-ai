"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full mt-20 p-10 rounded-[3rem] bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl border border-white/20 shadow-2xl"
      >
        <h1 className="text-5xl font-black text-gray-800 dark:text-white mb-6">About <span className="text-blue-500">FutureShop</span></h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          Welcome to the future of smart shopping. <strong>FutureShop</strong> uses advanced AI to scrape the web in real-time, ensuring you never pay more than you have to.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                <h3 className="font-bold text-blue-600 mb-2">🚀 AI Powered</h3>
                <p className="text-sm text-gray-500">Instant comparisons across 50+ major retailers.</p>
            </div>
            <div className="p-6 rounded-3xl bg-green-500/5 border border-green-500/10">
                <h3 className="font-bold text-green-600 mb-2">💎 Best Deals</h3>
                <p className="text-sm text-gray-500">Our algorithms track price history to find true steals.</p>
            </div>
        </div>
        <Link href="/">
          <motion.button whileHover={{ scale: 1.05 }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black">
            Start Shopping
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}