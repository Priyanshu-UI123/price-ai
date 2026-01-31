"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebase"; 
import Link from "next/link";
import { useTheme } from "next-themes"; 
import { motion, AnimatePresence } from "framer-motion";

// 🔹 PREMIUM MARQUEE BANNER
function TopScrollingBanner() {
    const router = useRouter();
    const alerts = [
        { text: "🔥 FLASHSALE: Get up to 40% off on Refurbished iPhones!", query: "iPhone" },
        { text: "🚀 TRENDING: Sony PS5 Pro prices just dropped!", query: "PS5 Pro" },
        { text: "💎 EXCLUSIVE: Lowest price found for MacBook Air M2", query: "MacBook Air M2" },
        { text: "⚡ SPEEDY: Real-time price tracking active for 50+ stores", query: "deals" },
        { text: "🌟 NEW: Check prices for Luxury Watch Collections", query: "Rolex" },
        { text: "📱 GRAB IT: Samsung S24 Ultra now starting at ₹1,09,999", query: "S24 Ultra" }
    ];

    return (
        <div className="fixed top-0 left-0 w-full h-10 bg-white/10 dark:bg-black/20 backdrop-blur-xl border-b border-white/10 z-[100] flex items-center shadow-2xl">
            <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                className="flex whitespace-nowrap"
            >
                {[...alerts, ...alerts].map((item, i) => (
                    <button 
                        key={i} 
                        onClick={() => router.push(`/results?q=${encodeURIComponent(item.query)}`)}
                        className="mx-12 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                    >
                        {item.text}
                    </button>
                ))}
            </motion.div>
        </div>
    );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User | null>(null); 
  const router = useRouter();
  const { theme, setTheme } = useTheme(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsMenuOpen(false);
  };

  if (!mounted) return null;

  // 🔹 Reusable Animated Nav Button Component
  const NavButton = ({ href, label, icon, color }: { href: string, label: string, icon: string, color: string }) => (
    <Link href={href}>
        <motion.button
            whileHover={{ scale: 1.15, y: -5, boxShadow: `0 20px 40px ${color}` }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/40 dark:border-gray-700/50 shadow-lg text-gray-700 dark:text-gray-200 transition-all`}
        >
            <span>{icon}</span> {label}
        </motion.button>
    </Link>
  );

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-700">
      
      {/* 🔹 STUNNING MESH GRADIENTS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-600/10 dark:to-cyan-600/10 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360, scale: [1.1, 1, 1.1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-gradient-to-tr from-purple-400/20 to-pink-400/20 dark:from-purple-600/10 dark:to-pink-600/10 blur-[120px] rounded-full"
          />
      </div>

      <TopScrollingBanner />

      {/* 🔹 TOP NAVIGATION */}
      <div className="absolute top-16 right-6 z-50 flex items-center gap-3">
          
          <div className="hidden md:flex items-center gap-4">
              {/* ✨ About Nav Button */}
              <NavButton href="/about" label="About" icon="✨" color="rgba(168,85,247,0.3)" />

              {user ? (
                  <>
                      <NavButton href="/orders" label="Orders" icon="📦" color="rgba(59,130,246,0.3)" />
                      <NavButton href="/wishlist" label="Wishlist" icon="❤️" color="rgba(239,68,68,0.3)" />
                      <NavButton href="/cart" label="Cart" icon="🛒" color="rgba(34,197,94,0.3)" />
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        onClick={handleLogout}
                        className="px-6 py-2.5 rounded-2xl bg-red-500 text-white font-black shadow-xl shadow-red-500/20"
                      >
                        Logout
                      </motion.button>
                  </>
              ) : (
                  <div className="flex gap-4">
                      <Link href="/login"><button className="px-6 py-2.5 rounded-2xl font-bold bg-white/80 dark:bg-gray-800 shadow-xl dark:text-white">Login</button></Link>
                      <Link href="/signup"><button className="px-6 py-2.5 rounded-2xl font-bold bg-blue-500 text-white shadow-xl shadow-blue-500/30">Sign Up</button></Link>
                  </div>
              )}
          </div>

          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl border border-white/20 shadow-xl">
              {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Hamburger (Mobile) */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl shadow-xl">
              {isMenuOpen ? "✕" : "☰"}
          </button>
      </div>

      {/* 🔹 MOBILE MENU */}
      <AnimatePresence>
          {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="fixed inset-y-0 right-0 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl z-[200] p-10 flex flex-col gap-6 shadow-2xl border-l border-white/20"
              >
                  <button onClick={() => setIsMenuOpen(false)} className="self-end text-3xl">✕</button>
                  <div className="font-black text-2xl dark:text-white">Menu</div>
                  
                  {/* ✨ Mobile About Link */}
                  <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold dark:text-white">✨ About Us</Link>
                  
                  {user ? (
                      <>
                        <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold dark:text-white">📦 Orders</Link>
                        <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold dark:text-white">❤️ Wishlist</Link>
                        <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold dark:text-white">🛒 Cart</Link>
                        <button onClick={handleLogout} className="text-xl font-bold text-red-500 text-left">Logout</button>
                      </>
                  ) : (
                      <>
                        <Link href="/login" className="text-xl font-bold dark:text-white">Login</Link>
                        <Link href="/signup" className="text-xl font-bold text-blue-500">Sign Up</Link>
                      </>
                  )}
              </motion.div>
          )}
      </AnimatePresence>

      {/* 🔹 HERO CONTENT */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center w-full max-w-5xl"
      >
        {user && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm mb-6"
            >
                Welcome back, {user.displayName || "Shopper"} 👋
            </motion.div>
        )}

        <motion.h1 
          className="text-8xl md:text-[11rem] font-black tracking-tighter text-gray-900 dark:text-white mb-10 text-center leading-[0.8]"
        >
            Price<span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 drop-shadow-2xl">AI</span>
        </motion.h1>

        <form onSubmit={(e) => { e.preventDefault(); if(query) router.push(`/results?q=${query}`); }} className="w-full max-w-3xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <input
                type="text"
                placeholder="Search premium products..."
                className="relative w-full p-8 pl-10 pr-24 rounded-[2.5rem] text-2xl outline-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl text-gray-800 dark:text-white border border-white/20 shadow-2xl transition-all focus:ring-4 focus:ring-blue-500/20"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <motion.button 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center text-2xl"
                >
                    🔍
                </motion.button>
            </div>
        </form>

        <p className="mt-12 text-gray-400 dark:text-gray-500 font-bold tracking-[0.4em] text-[10px] uppercase">
            The intelligent commerce engine
        </p>
      </motion.div>

      {/* 🔹 DECORATIVE ELEMENTS */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-2 opacity-10 dark:opacity-5 pointer-events-none">
          <div className="w-20 h-2 bg-blue-500 rounded-full" />
          <div className="w-40 h-2 bg-blue-500 rounded-full" />
          <div className="w-10 h-2 bg-blue-500 rounded-full" />
      </div>

    </div>
  );
}