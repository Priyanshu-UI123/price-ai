"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSearch = () => {
    if (query) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300 bg-[#f0f4f8] dark:bg-[#1e293b]">
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
          bg-[#f0f4f8] dark:bg-[#1e293b] text-xl
          shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]
          dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55]
          active:scale-95"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Main Container */}
      <div className="p-10 rounded-[3rem] max-w-xl w-full flex flex-col items-center text-center transition-all duration-300
        bg-[#f0f4f8] dark:bg-[#1e293b]
        shadow-[20px_20px_60px_#cdd4db,-20px_-20px_60px_#ffffff]
        dark:shadow-[20px_20px_60px_#0f172a,-20px_-20px_60px_#2d3b55]"
      >
        <h1 className="text-5xl font-extrabold mb-8 tracking-tight text-gray-700 dark:text-gray-200">
          Price<span className="text-blue-500">AI</span> {theme === "dark" ? "🌌" : "🍦"}
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg font-medium">
          Find the best deals across Amazon, Flipkart & more.
        </p>
        
        <div className="w-full flex flex-col gap-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for iPhone 15..."
            className="w-full p-5 text-xl rounded-2xl outline-none transition-all
            bg-[#f0f4f8] dark:bg-[#1e293b]
            text-gray-600 dark:text-gray-200 placeholder-gray-400
            shadow-[inset_6px_6px_12px_#cdd4db,inset_-6px_-6px_12px_#ffffff] 
            dark:shadow-[inset_6px_6px_12px_#0f172a,inset_-6px_-6px_12px_#2d3b55]
            focus:border focus:border-blue-500/30"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          
          <button
            onClick={handleSearch}
            className="w-full py-4 text-xl font-bold text-white rounded-2xl transition-transform active:scale-95 bg-blue-500
            shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]
            dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55]
            hover:bg-blue-600"
          >
            Find Best Price 🚀
          </button>
        </div>
      </div>
    </div>
  );
}