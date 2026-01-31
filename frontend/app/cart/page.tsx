"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import Link from "next/link";
import { useTheme } from "next-themes";

interface Product {
  name: string;
  price: string;
  displayPrice: string;
  source: string;
  link: string;
  image: string;
}

export default function CartPage() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  // 🔹 Unique ID Helper (Same as Results/Wishlist)
  const getProductId = (item: Product) => {
    return `${item.source}-${item.name}-${item.price}`.replace(/\s+/g, '').toLowerCase();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().cart) {
          setCart(docSnap.data().cart);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const removeFromCart = async (item: Product) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const targetId = getProductId(item);

    // 🔹 FIX: Filter by Unique ID so we don't wipe everything
    setCart((prev) => prev.filter((i) => getProductId(i) !== targetId));

    // Remove from Database
    await updateDoc(docRef, { cart: arrayRemove(item) });
  };

  // Helper to parse price string
  const getPrice = (priceStr: string) => {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
  };

  const totalPrice = cart.reduce((acc, item) => acc + getPrice(item.price), 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl font-bold dark:text-white">Loading Cart...</div>;

  return (
    <div className="min-h-screen p-6 md:p-12 bg-[#f0f4f8] dark:bg-[#1e293b] font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between p-6 rounded-[2rem] 
          bg-[#f0f4f8] dark:bg-[#1e293b]
          shadow-[10px_10px_20px_#cdd4db,-10px_-10px_20px_#ffffff]
          dark:shadow-[10px_10px_20px_#0f172a,-10px_-10px_20px_#2d3b55]">
          
            <div className="flex items-center gap-4">
                <Link href="/" className="w-12 h-12 flex items-center justify-center rounded-full text-blue-500 
                    bg-[#f0f4f8] dark:bg-[#1e293b]
                    shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]
                    dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55]
                    hover:scale-95 transition-transform">
                    ←
                </Link>
                <h1 className="text-2xl font-black text-gray-700 dark:text-gray-200">
                    Shopping Cart 🛒
                </h1>
            </div>

            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-12 h-12 rounded-full flex items-center justify-center text-xl
                bg-[#f0f4f8] dark:bg-[#1e293b]
                shadow-[6px_6px_12px_#cdd4db,-6px_-6px_12px_#ffffff]
                dark:shadow-[6px_6px_12px_#0f172a,-6px_-6px_12px_#2d3b55]">
                {theme === "dark" ? "☀️" : "🌙"}
            </button>
        </div>
        
        {cart.length === 0 ? (
           <div className="text-center mt-20">
             <p className="text-xl text-gray-400 font-bold">Your cart is empty.</p>
             <Link href="/">
                <button className="mt-6 px-8 py-3 bg-blue-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
                    Go Shopping
                </button>
             </Link>
           </div>
        ) : (
          <div className="flex flex-col gap-6">
            {cart.map((item, index) => {
              // Create a unique key using ID + index to prevent render glitches
              const itemId = getProductId(item);
              
              return (
                <div key={`${itemId}-${index}`} className="flex items-center gap-4 p-4 rounded-[2rem] 
                  bg-[#f0f4f8] dark:bg-[#1e293b]
                  shadow-[8px_8px_16px_#cdd4db,-8px_-8px_16px_#ffffff]
                  dark:shadow-[8px_8px_16px_#0f172a,-8px_-8px_16px_#2d3b55]">
                  
                  <img src={item.image} alt="product" className="w-20 h-20 object-contain mix-blend-multiply dark:mix-blend-normal" />
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 line-clamp-1">{item.name}</h3>
                    <p className="text-blue-500 font-bold">{item.displayPrice || item.price}</p>
                    <span className="text-xs text-gray-400 font-bold uppercase">{item.source}</span>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item)} 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-red-500 font-bold
                    bg-[#f0f4f8] dark:bg-[#1e293b]
                    shadow-[4px_4px_8px_#cdd4db,-4px_-4px_8px_#ffffff]
                    dark:shadow-[4px_4px_8px_#0f172a,-4px_-4px_8px_#2d3b55]
                    hover:scale-95 active:scale-90 transition-all"
                    title="Remove Item"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            
            {/* Total & Checkout */}
            <div className="mt-8 p-6 rounded-[2rem] bg-blue-500 text-white shadow-xl flex justify-between items-center">
                <div>
                    <p className="text-sm opacity-80">Total Amount</p>
                    <h2 className="text-3xl font-black">₹{totalPrice.toLocaleString()}</h2>
                </div>
                <Link href="/checkout">
                    <button className="px-8 py-3 bg-white text-blue-600 font-black rounded-xl shadow-lg hover:scale-105 transition-transform">
                        CHECKOUT ➔
                    </button>
                </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}