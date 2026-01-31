"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";

interface Product {
  name: string;
  price: string;
  displayPrice: string;
  source: string;
  link: string;
  image: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q"); 
  const { theme, setTheme } = useTheme(); 
  
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`https://price-ai.onrender.com/search/${query}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results);
          setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans transition-colors duration-300 bg-[#f0f4f8] dark:bg-[#1e293b]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-row items-center justify-between p-6 rounded-[2rem] transition-all
          bg-[#f0f4f8] dark:bg-[#1e293b]
          shadow-[10px_10px_20px_#cdd4db,-10px_-10px_20px_#ffffff]
          dark:shadow-[10px_10px_20px_#0f172a,-10px_-10px_20px_#2d3b55]">
            
            <div className="flex items-center gap-4">
              <a href="/" className="w-12 h-12 flex items-center justify-center rounded-full text-blue-500 transition-transform hover:scale-95
                bg-[#f0f4f8] dark:bg-[#1e293b]
                shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]
                dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55]">
                ←
              </a>
              <h1 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-200">
                Results for: <span className="text-blue-500 capitalize">{query}</span>
              </h1>
            </div>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all
              bg-[#f0f4f8] dark:bg-[#1e293b]
              shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]
              dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55]"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500"></div>
            <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 font-medium">Inflating results...</p>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map((item, index) => (
              <div 
                key={index} 
                className="rounded-[2.5rem] p-4 flex flex-col group transition-all duration-300 hover:-translate-y-2
                bg-[#f0f4f8] dark:bg-[#1e293b]
                shadow-[12px_12px_24px_#cdd4db,-12px_-12px_24px_#ffffff]
                dark:shadow-[12px_12px_24px_#0f172a,-12px_-12px_24px_#2d3b55]"
              >
                {/* Image */}
                <div className="h-48 rounded-[2rem] flex items-center justify-center relative p-4 mb-4 overflow-hidden
                   bg-[#f0f4f8] dark:bg-[#1e293b]
                   shadow-[inset_6px_6px_12px_#cdd4db,inset_-6px_-6px_12px_#ffffff]
                   dark:shadow-[inset_6px_6px_12px_#0f172a,inset_-6px_-6px_12px_#2d3b55]">
                    
                    <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-extrabold text-blue-500 rounded-full uppercase tracking-wider
                      bg-[#f0f4f8] dark:bg-[#1e293b]
                      shadow-[4px_4px_8px_#cdd4db,-4px_-4px_8px_#ffffff]
                      dark:shadow-[4px_4px_8px_#0f172a,-4px_-4px_8px_#2d3b55]">
                        {item.source}
                    </span>
                    
                    {item.image ? (
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal" 
                        />
                    ) : (
                        <div className="text-gray-300 text-xs">No Image</div>
                    )}
                </div>

                {/* Details */}
                <div className="px-2 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-gray-700 dark:text-gray-200 text-md leading-snug mb-3 line-clamp-2" title={item.name}>
                    {item.name}
                  </h3>
                  
                  <div className="flex items-end justify-between mt-2">
                     <div>
                        <p className="text-xs text-gray-400 font-bold mb-1">BEST PRICE</p>
                        <p className="text-2xl font-black text-gray-800 dark:text-gray-100">
                            {item.displayPrice || `₹${item.price}`}
                        </p>
                     </div>
                     <a 
                       href={item.link} 
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-blue-500
                       shadow-[4px_4px_8px_#cdd4db,-4px_-4px_8px_#ffffff]
                       dark:shadow-[4px_4px_8px_#0f172a,-4px_-4px_8px_#2d3b55]"
                     >
                       ➔
                     </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}