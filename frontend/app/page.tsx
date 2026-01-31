"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8] font-sans">
      
      {/* 1. Main Container (The Clay Tablet) */}
      <div className="bg-[#f0f4f8] p-10 rounded-[3rem] shadow-[20px_20px_60px_#cdd4db,-20px_-20px_60px_#ffffff] max-w-xl w-full flex flex-col items-center text-center">
        
        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-8 text-gray-700 tracking-tight">
          Price<span className="text-blue-500">AI</span> 🍦
        </h1>
        
        <p className="text-gray-500 mb-8 text-lg font-medium">
          Find the best deals across Amazon, Flipkart & more.
        </p>
        
        <div className="w-full flex flex-col gap-6">
          {/* 2. Input Field (Pressed In / Debossed Look) */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for iPhone 15..."
            className="w-full p-5 text-xl bg-[#f0f4f8] rounded-2xl text-gray-600 placeholder-gray-400 outline-none transition-all
            shadow-[inset_6px_6px_12px_#cdd4db,inset_-6px_-6px_12px_#ffffff] 
            focus:shadow-[inset_4px_4px_8px_#cdd4db,inset_-4px_-4px_8px_#ffffff] border border-transparent focus:border-blue-200"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          
          {/* 3. Button (Popped Out / Embossed Look) */}
          <button
            onClick={handleSearch}
            className="w-full py-4 text-xl font-bold text-white rounded-2xl transition-transform active:scale-95 bg-blue-500
            shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]
            hover:bg-blue-600 hover:shadow-[8px_8px_16px_#cdd4db,-8px_-8px_16px_#ffffff]"
          >
            Find Best Price 🚀
          </button>
        </div>
      </div>

      <div className="mt-12 text-gray-400 text-sm font-semibold tracking-wide">
        POWERED BY SERPAPI & AI
      </div>
    </div>
  );
}