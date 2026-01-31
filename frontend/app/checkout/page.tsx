"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase"; 
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Product {
  name: string;
  price: string;
  displayPrice: string;
  source: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // 🔹 Cart & Order State
  const [lastOrderCart, setLastOrderCart] = useState<Product[]>([]);
  const [orderId, setOrderId] = useState("");

  // 🔹 Card Input State for Animation
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().cart) {
           setLastOrderCart(docSnap.data().cart);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔹 INVOICE GENERATOR
  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("PriceAI Invoice", 14, 20);

    doc.setFontSize(10);
    doc.text(`Order ID: #${orderId}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
    doc.text(`Customer: ${user?.displayName || "Valued Customer"}`, 14, 40);

    const tableColumn = ["Item", "Store", "Price"];
    const tableRows: any[] = [];
    let total = 0;

    lastOrderCart.forEach((item) => {
      const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      total += priceVal;
      tableRows.push([item.name.substring(0, 30) + "...", item.source, item.displayPrice || item.price]);
    });

    tableRows.push(["", "TOTAL", `Rs. ${total.toLocaleString()}`]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`PriceAI_Invoice_${orderId}.pdf`);
  };

  const handlePayment = async () => {
    setLoading(true);
    const newOrderId = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderId(newOrderId);
    const orderDate = new Date().toISOString();
    const totalAmount = lastOrderCart.reduce((acc, item) => acc + (parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0), 0);

    await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay for realism

    if (user) {
        try {
            const docRef = doc(db, "users", user.uid);
            const newOrder = {
                id: newOrderId,
                date: orderDate,
                items: lastOrderCart,
                total: totalAmount,
                method: method
            };
            await updateDoc(docRef, {
                orders: arrayUnion(newOrder),
                cart: [] 
            });
        } catch (e) {
            console.error("Error saving order:", e);
        }
    }

    setLoading(false);
    setSuccess(true); 
  };

  // 🔹 SUCCESS SCREEN
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8] dark:bg-[#1e293b] font-sans p-6 text-center">
        <div className="relative flex items-center justify-center w-32 h-32 bg-green-500 rounded-full animate-bounce-in shadow-2xl shadow-green-500/50 mb-8">
            <svg className="w-16 h-16 text-white animate-draw-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2 animate-fade-up">Payment Successful! 🎉</h1>
        <p className="text-gray-500 dark:text-gray-400 animate-fade-up delay-100 mb-8">Order #{orderId} has been saved to your history.</p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs animate-fade-up delay-200">
            <button onClick={downloadInvoice} className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                <span>📄</span> Download Invoice
            </button>
            <button onClick={() => router.push("/")} className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                Return to Home
            </button>
        </div>
        <style jsx>{`
          @keyframes bounce-in { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); } }
          @keyframes draw-check { 0% { stroke-dasharray: 100; stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }
          @keyframes fade-up { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
          .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }
          .animate-draw-check { stroke-dasharray: 100; animation: draw-check 1s ease-out forwards 0.5s; }
          .animate-fade-up { animation: fade-up 0.8s ease-out forwards; }
          .delay-100 { animation-delay: 0.2s; }
          .delay-200 { animation-delay: 0.4s; }
        `}</style>
      </div>
    );
  }

  // 🔹 PAYMENT FORM
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f0f4f8] dark:bg-[#1e293b]">
      <div className="w-full max-w-md p-8 rounded-[2.5rem] bg-[#f0f4f8] dark:bg-[#1e293b] shadow-[20px_20px_40px_#cdd4db,-20px_-20px_40px_#ffffff] dark:shadow-[20px_20px_40px_#0f172a,-20px_-20px_40px_#2d3b55]">
        <h2 className="text-3xl font-black text-gray-700 dark:text-gray-200 mb-8 tracking-tight">Checkout 💳</h2>
        
        {/* Payment Tabs */}
        <div className="flex gap-4 mb-8 p-2 rounded-2xl bg-gray-200/50 dark:bg-gray-800/50">
            {['card', 'upi', 'cod'].map((m) => (
                <button key={m} onClick={() => setMethod(m)} className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300 ${method === m ? "bg-blue-500 text-white shadow-[0px_4px_12px_rgba(59,130,246,0.5)] scale-105" : "text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700/50"}`}>{m}</button>
            ))}
        </div>

        {/* Dynamic Payment UI */}
        <div className="mb-8 min-h-[180px]">
            
            {/* 💳 VIRTUAL CARD UI - FIXED LAYOUT */}
            {method === "card" && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* The Card Container - Now uses flex flex-col justify-between */}
                    <div className="relative w-full h-52 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white p-6 shadow-2xl transform transition-transform hover:scale-105 duration-300 flex flex-col justify-between">
                        
                        {/* Top Section Group */}
                        <div>
                            <div className="flex justify-between items-start">
                                <div className="text-xs font-bold opacity-80 uppercase tracking-widest">Debit Card</div>
                                <div className="text-xl font-black italic opacity-80">VISA</div>
                            </div>
                            <div className="mt-4 w-12 h-9 rounded-md bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-80 border border-yellow-500 shadow-sm relative overflow-hidden">
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-yellow-600/50"></div>
                            <div className="absolute top-0 left-1/3 w-[1px] h-full bg-yellow-600/50"></div>
                            <div className="absolute top-0 right-1/3 w-[1px] h-full bg-yellow-600/50"></div>
                            </div>
                        </div>

                        {/* Bottom Section Group */}
                        <div>
                            <div className="mb-2">
                                <p className="text-2xl font-mono tracking-widest drop-shadow-md whitespace-nowrap overflow-hidden">
                                    {cardNumber || "#### #### #### ####"}
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] uppercase opacity-75">Card Holder</p>
                                    <p className="font-bold tracking-wide text-sm truncate max-w-[150px]">{user?.displayName?.toUpperCase() || "YOUR NAME"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase opacity-75">Expires</p>
                                    <p className="font-bold tracking-wide text-sm">{cardExpiry || "MM/YY"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="flex flex-col gap-4">
                        <div className="relative group">
                             <input 
                                type="text" 
                                placeholder="Card Number" 
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full p-4 pl-12 rounded-xl bg-transparent border-none outline-none shadow-[inset_4px_4px_8px_#cdd4db,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0f172a,inset_-4px_-4px_8px_#2d3b55] focus:ring-2 focus:ring-blue-400 transition-all font-mono" 
                             />
                             <span className="absolute left-4 top-4 text-xl opacity-50">💳</span>
                        </div>
                        <div className="flex gap-4">
                             <input 
                                type="text" 
                                placeholder="MM/YY" 
                                maxLength={5}
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-1/2 p-4 rounded-xl bg-transparent outline-none shadow-[inset_4px_4px_8px_#cdd4db,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0f172a,inset_-4px_-4px_8px_#2d3b55] focus:ring-2 focus:ring-blue-400 transition-all text-center" 
                             />
                             <input 
                                type="password" 
                                placeholder="CVV" 
                                maxLength={3}
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                className="w-1/2 p-4 rounded-xl bg-transparent outline-none shadow-[inset_4px_4px_8px_#cdd4db,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0f172a,inset_-4px_-4px_8px_#2d3b55] focus:ring-2 focus:ring-blue-400 transition-all text-center" 
                             />
                        </div>
                    </div>
                </div>
            )}

            {/* 📱 MOCK UPI UI */}
            {method === "upi" && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-full bg-white dark:bg-white p-4 flex flex-col items-center justify-center rounded-2xl shadow-lg group hover:shadow-xl transition-all">
                        {/* Real Generated QR Code */}
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PriceAI_Payment_${Math.random()}`} 
                            alt="UPI QR" 
                            className="w-40 h-40 mix-blend-multiply" 
                        />
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Scan to Pay</p>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Enter UPI ID (e.g. user@oksbi)" className="w-full p-4 pl-12 rounded-xl bg-transparent outline-none shadow-[inset_4px_4px_8px_#cdd4db,inset_-4px_-4px_8px_#ffffff] dark:shadow-[inset_4px_4px_8px_#0f172a,inset_-4px_-4px_8px_#2d3b55] focus:ring-2 focus:ring-blue-400 transition-all" />
                        <span className="absolute left-4 top-4 text-lg opacity-50">📱</span>
                    </div>
                </div>
            )}

            {/* 📦 COD UI */}
            {method === "cod" && (
                <div className="flex flex-col items-center justify-center h-full animate-in fade-in slide-in-from-bottom-4 duration-500 py-4 gap-4">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-5xl shadow-inner animate-bounce">📦</div>
                    <div className="text-center">
                        <p className="text-gray-700 dark:text-gray-200 font-bold text-xl">Cash on Delivery</p>
                        <p className="text-gray-400 text-sm mt-1 max-w-[200px] mx-auto">Pay securely with cash when your order arrives at your doorstep.</p>
                    </div>
                </div>
            )}
        </div>

        {/* Animated Pay Button */}
        <button onClick={handlePayment} disabled={loading} className={`group relative w-full py-4 rounded-2xl font-black text-white text-lg tracking-wider overflow-hidden transition-all duration-300 active:scale-95 shadow-[0px_10px_20px_rgba(0,0,0,0.1)] ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"}`}>
            <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>PROCESSING...</span>
                    </>
                ) : (
                    <><span>PAY {method === 'cod' ? 'LATER' : 'NOW'}</span><span className="group-hover:translate-x-1 transition-transform">➔</span></>
                )}
            </div>
            {!loading && <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />}
        </button>

      </div>
    </div>
  );
}