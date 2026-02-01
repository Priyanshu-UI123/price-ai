"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, getDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

// 🔹 TYPE DEFINITIONS
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: any;
}

interface ActivityData {
  searches: string[];
  cartItems: number;
  lastActive: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false); // New loading state for modal
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // 🔹 1. AUTH & ROLE CHECK
  useEffect(() => {
    const checkAccess = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          router.push("/login");
          return;
        }
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
          fetchUsers();
        } else {
          router.push("/");
        }
      });
    };
    checkAccess();
  }, [router]);

  // 🔹 2. FETCH ALL USERS
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 3. FETCH SPECIFIC USER ACTIVITY (REAL DATA)
  const handleViewActivity = async (user: UserData) => {
    setSelectedUser(user);
    setActivityLoading(true); // Start loading spinner in modal
    
    try {
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();

            // Extract Search History (Sort by newest)
            const rawHistory = data.searchHistory || [];
            // If stored as objects {term, timestamp}, map to string. If just strings, keep as is.
            const recentSearches = rawHistory
                .slice() // Create a copy to avoid mutating original
                .reverse() // Newest first
                .slice(0, 5) // Take top 5
                .map((h: any) => (typeof h === 'string' ? h : h.term));

            // Format Last Active Time
            let lastActiveDisplay = "Unknown";
            if (data.lastActive) {
                // Try to format nicely if possible, else use standard date string
                try {
                   lastActiveDisplay = new Date(data.lastActive).toLocaleString();
                } catch (e) {
                   lastActiveDisplay = "Invalid Date";
                }
            }

            setActivity({
                searches: recentSearches.length > 0 ? recentSearches : ["No history found"],
                cartItems: data.cart ? data.cart.length : 0, // Assuming 'cart' is an array of items
                lastActive: lastActiveDisplay,
            });
        } else {
             // Fallback if doc is weirdly missing
             setActivity({ searches: ["No data"], cartItems: 0, lastActive: "N/A" });
        }
    } catch (error) {
        console.error("Error fetching activity", error);
        setActivity({ searches: ["Error loading"], cartItems: 0, lastActive: "Error" });
    } finally {
        setActivityLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to ban this user?")) {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-[#020617]">Verifying Admin Access...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-10 font-sans relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Admin Console
          </h1>
          <p className="text-gray-400 mt-2">Monitor user activity and manage access.</p>
        </div>
        <button onClick={() => router.push("/")} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-sm font-bold">
          ← Back to Site
        </button>
      </div>

      {/* Users Table */}
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
              <th className="p-6">User Name</th>
              <th className="p-6">Email</th>
              <th className="p-6">Role</th>
              <th className="p-6 text-right">Monitoring</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <motion.tr 
                key={user.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <td className="p-6 font-bold">{user.name || "Anonymous"}</td>
                <td className="p-6 text-gray-300 font-mono text-sm">{user.email}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.role || "USER"}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => handleViewActivity(user)}
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-widest border border-cyan-500/30 px-3 py-1 rounded-lg hover:bg-cyan-500/10 transition"
                  >
                    View Activity
                  </button>
                </td>
                <td className="p-6 text-right">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-400 text-xs font-bold"
                    >
                      Ban
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 ACTIVITY MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedUser.name}</h2>
                  <p className="text-sm text-gray-400 font-mono">{selectedUser.email}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-white text-xl">✕</button>
              </div>

              {activityLoading ? (
                  // Loading State for Modal content
                  <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
              ) : (
                  <div className="space-y-6">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Items in Cart</p>
                        <p className="text-3xl font-black text-blue-400">{activity?.cartItems || 0}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Last Active</p>
                        <p className="text-sm font-bold text-green-400">{activity?.lastActive || "Never"}</p>
                      </div>
                    </div>

                    {/* Recent Searches */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Recent Search History</p>
                      <div className="flex flex-wrap gap-2">
                        {activity?.searches && activity.searches.length > 0 ? (
                            activity.searches.map((term, i) => (
                            <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                                🔍 {term}
                            </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-500 italic">No recent searches</span>
                        )}
                      </div>
                    </div>
                  </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <button onClick={() => setSelectedUser(null)} className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}