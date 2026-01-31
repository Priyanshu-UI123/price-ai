"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
  
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      // REMEMBER: Keep this as your Render URL for production!
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
    <div className="max-w-7xl mx-auto">
      {/* Clay Header */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between bg-[#f0f4f8] p-6 rounded-[2rem] shadow-[10px_10px_20px_#cdd4db,-10px_-10px_20px_#ffffff]">
          <div className="flex items-center gap-4">
            <a href="/" className="bg-[#f0f4f8] w-12 h-12 flex items-center justify-center rounded-full text-blue-500 shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff] hover:scale-95 transition-transform">
              ←
            </a>
            <h1 className="text-2xl font-bold text-gray-700">
              Results for: <span className="text-blue-500 capitalize">{query}</span>
            </h1>
          </div>
      </div>

      {/* Loading State - Clay Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]"></div>
          <p className="mt-6 text-xl text-gray-500 font-medium">Inflating results...</p>
        </div>
      ) : (
        /* Results Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {results.map((item, index) => (
            <div 
              key={index} 
              className="bg-[#f0f4f8] rounded-[2.5rem] p-4 flex flex-col group transition-all duration-300
              shadow-[12px_12px_24px_#cdd4db,-12px_-12px_24px_#ffffff]
              hover:shadow-[16px_16px_32px_#cdd4db,-16px_-16px_32px_#ffffff] hover:-translate-y-2"
            >
              
              {/* Product Image Container (Inset Clay) */}
              <div className="h-48 rounded-[2rem] bg-[#f0f4f8] flex items-center justify-center relative p-4
                 shadow-[inset_6px_6px_12px_#cdd4db,inset_-6px_-6px_12px_#ffffff]">
                  
                  {/* Floating Badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-extrabold text-blue-500 bg-[#f0f4f8] rounded-full uppercase tracking-wider shadow-[4px_4px_8px_#cdd4db,-4px_-4px_8px_#ffffff]">
                      {item.source}
                  </span>
                  
                  {item.image ? (
                      <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-contain mix-blend-multiply" 
                      />
                  ) : (
                      <div className="text-gray-300 text-xs">No Image</div>
                  )}
              </div>

              {/* Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-gray-700 text-md leading-snug mb-3 line-clamp-2" title={item.name}>
                  {item.name}
                </h3>
                
                <div className="flex items-end justify-between mt-2">
                   <div>
                      <p className="text-xs text-gray-400 font-bold mb-1">BEST PRICE</p>
                      <p className="text-2xl font-black text-gray-800">
                          {item.displayPrice || `₹${item.price}`}
                      </p>
                   </div>
                   
                   {/* Buy Button (Small Clay Pop) */}
                   <a 
                     href={item.link} 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-[4px_4px_8px_#cdd4db,-4px_-4px_8px_#ffffff] hover:scale-110 transition-transform"
                   >
                     ➔
                   </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && results.length === 0 && (
          <div className="text-center mt-20 text-gray-400 font-medium">
              <p className="text-xl">No results found 😢</p>
              <p>Try searching for "Samsung S24"</p>
          </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] p-6 md:p-12 font-sans text-gray-900">
      <Suspense fallback={<div className="text-center mt-20 text-gray-400">Loading Clay UI...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}