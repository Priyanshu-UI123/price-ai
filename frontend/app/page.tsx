"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebase"; 
import Link from "next/link";
import { useTheme } from "next-themes"; 

export default function Home() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User | null>(null); 
  const router = useRouter();
  const { theme, setTheme } = useTheme(); 
  
  // State to handle the Mobile Dropdown Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsMenuOpen(false); // Close menu after logout
    alert("Logged out successfully!");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 bg-[#f0f4f8] dark:bg-[#1e293b]">
      
      {/* 🔹 Top Navigation Bar */}
      <div className="absolute top-6 right-6 z-50 flex flex-col items-end">
        
        {/* Top Row: Theme Toggle + Hamburger (Mobile) OR Full Menu (Desktop) */}
        <div className="flex items-center gap-4">
            
            {/* 🌙 Dark Mode Toggle (Always Visible) */}
            <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all
            bg-[#f0f4f8] dark:bg-[#1e293b]
            shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]
            dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55]
            hover:scale-110 active:scale-95"
            title="Toggle Theme"
            >
            {mounted ? (theme === "dark" ? "☀️" : "🌙") : "🌙"}
            </button>

            {/* 🍔 Hamburger Button (Visible ONLY on Mobile) */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                bg-[#f0f4f8] dark:bg-[#1e293b] text-gray-700 dark:text-gray-200
                shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]
                dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55]
                active:scale-95 transition-all"
            >
                {isMenuOpen ? "✕" : "☰"}
            </button>

            {/* 🖥️ DESKTOP MENU (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-4">
                {user ? (
                    <>
                        <Link href="/orders">
                            <button className="px-4 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-[#f0f4f8] dark:bg-[#1e293b] shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55] hover:scale-105 transition-transform">
                            📦 Orders
                            </button>
                        </Link>
                        <Link href="/wishlist">
                            <button className="px-4 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-[#f0f4f8] dark:bg-[#1e293b] shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55] hover:scale-105 transition-transform">
                            ❤️ Wishlist
                            </button>
                        </Link>
                        <Link href="/cart">
                            <button className="px-4 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-[#f0f4f8] dark:bg-[#1e293b] shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55] hover:scale-105 transition-transform">
                            🛒 Cart
                            </button>
                        </Link>
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                            {user.displayName ? `Hi, ${user.displayName.split(' ')[0]}` : "Welcome"} 👋
                        </span>
                        <button onClick={handleLogout} className="px-6 py-2 rounded-xl font-bold text-white bg-red-500 shadow-lg hover:scale-105 transition-transform">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login"><button className="px-6 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-[#f0f4f8] dark:bg-[#1e293b] shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55] hover:scale-105 transition-transform">Login</button></Link>
                        <Link href="/signup"><button className="px-6 py-2 rounded-xl font-bold text-white bg-blue-500 shadow-lg hover:scale-105 transition-transform">Sign Up</button></Link>
                    </>
                )}
            </div>
        </div>

        {/* 📱 MOBILE DROPDOWN MENU (Visible only when isMenuOpen is true) */}
        {isMenuOpen && (
            <div className="mt-4 w-48 flex flex-col gap-3 p-4 rounded-2xl bg-[#f0f4f8] dark:bg-[#1e293b] shadow-[10px_10px_20px_#cdd4db,-10px_-10px_20px_#ffffff] dark:shadow-[10px_10px_20px_#0f172a,-10px_-10px_20px_#2d3b55] md:hidden animate-in slide-in-from-top-2">
                {user ? (
                    <>
                        <div className="text-center font-bold text-gray-700 dark:text-gray-200 mb-2 border-b border-gray-300 dark:border-gray-700 pb-2">
                             {user.displayName ? `Hi, ${user.displayName.split(' ')[0]}` : "Welcome"} 👋
                        </div>
                        <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
                            <button className="w-full text-left px-4 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">📦 Orders</button>
                        </Link>
                        <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                            <button className="w-full text-left px-4 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">❤️ Wishlist</button>
                        </Link>
                        <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                            <button className="w-full text-left px-4 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">🛒 Cart</button>
                        </Link>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-xl font-bold text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                             <button className="w-full text-left px-4 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Login</button>
                        </Link>
                        <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                             <button className="w-full text-left px-4 py-2 rounded-xl font-bold text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">Sign Up</button>
                        </Link>
                    </>
                )}
            </div>
        )}

      </div>

      {/* 🔹 Title */}
      <h1 className="text-5xl md:text-7xl font-black text-gray-700 dark:text-gray-200 mb-8 tracking-tight text-center">
        Price<span className="text-blue-500">AI</span>
      </h1>

      {/* 🔹 Search Box */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
        <input
          type="text"
          placeholder="Search for anything..."
          className="w-full p-6 pl-8 pr-16 rounded-[2rem] text-xl outline-none transition-all
          bg-[#f0f4f8] dark:bg-[#1e293b] text-gray-700 dark:text-gray-200
          shadow-[inset_10px_10px_20px_#cdd4db,inset_-10px_-10px_20px_#ffffff]
          dark:shadow-[inset_10px_10px_20px_#0f172a,inset_-10px_-10px_20px_#2d3b55]
          focus:ring-2 focus:ring-blue-400 focus:shadow-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white bg-blue-500 
          shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]
          dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55]
          hover:scale-110 active:scale-95 transition-all"
        >
          🔍
        </button>
      </form>
      
      <p className="mt-8 text-gray-500 dark:text-gray-400 font-medium text-center px-4">
        Powered by AI • Real-time Prices • Smart Savings
      </p>
    </div>
  );
}