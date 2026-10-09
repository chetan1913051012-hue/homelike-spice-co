"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchOrders(data.user.id);
    });
  }, []);

  async function fetchOrders(userId: string) {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setOrders(data || []);
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : "Registration successful! Please check your email to verify your account.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else {
        setUser(data.user);
        fetchOrders(data.user.id);
      }
    }
  }

  async function handlePasswordReset() {
    if (!email) return alert("Enter your email first to reset password.");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setMessage(error ? error.message : "Password reset link sent to your email.");
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-2xl border border-wood/10 space-y-4">
          <h1 className="text-2xl font-bold text-wood">{isSignUp ? "Create Account" : "Sign In"}</h1>
          {message && <p className="text-sm text-forest bg-parchment p-3 rounded">{message}</p>}
          <form onSubmit={handleAuth} className="space-y-4">
            <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-4 py-2.5" />
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-4 py-2.5" />
            <button type="submit" className="w-full bg-forest text-white py-3 rounded-full font-semibold">
              {isSignUp ? "Register" : "Login"}
            </button>
          </form>
          <div className="flex justify-between text-xs text-wood/80 pt-2">
            <button onClick={() => setIsSignUp(!isSignUp)} className="hover:text-forest transition">
              {isSignUp ? "Already have an account? Login" : "New customer? Create an account"}
            </button>
            <button onClick={handlePasswordReset} className="hover:text-forest transition">Forgot Password?</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="flex justify-between items-center bg-parchment p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-wood">My Account</h1>
          <p className="text-sm text-wood/75">{user.email}</p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
          }}
          className="px-5 py-2 bg-chilli text-white rounded-full text-sm font-semibold"
        >
          Logout
        </button>
      </div>

      <h2 className="text-xl font-bold text-wood">Order History & Tracking</h2>
      {orders.length === 0 ? (
        <p className="text-wood/70">No orders placed yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => {
            const steps = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
            const currentStepIndex = o.status === "Cancelled" ? -1 : steps.indexOf(o.status);
            const activeIndex = o.status === "Payment Confirmed" ? 0 : currentStepIndex;

            return (
              <div key={o.id} className="bg-white p-6 sm:p-8 rounded-2xl border border-wood/10 space-y-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center border-b border-wood/10 pb-4">
                  <div>
                    <span className="font-bold text-wood block text-lg">Order #{o.order_number}</span>
                    <span className="text-sm text-wood/75">Total: ₹{o.total_amount} • {o.payment_status}</span>
                  </div>
                  {o.status === "Cancelled" ? (
                    <span className="px-4 py-1.5 rounded-full bg-chilli/10 text-chilli text-xs font-bold uppercase tracking-wider">Cancelled</span>
                  ) : (
                    <span className="px-4 py-1.5 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">{o.status}</span>
                  )}
                </div>

                {o.status !== "Cancelled" && (
                  <div className="relative pt-4 pb-2">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-parchment -translate-y-1/2 rounded-full z-0"></div>
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-forest -translate-y-1/2 rounded-full z-0 transition-all duration-700 ease-in-out" 
                      style={{ width: `${Math.max(0, (activeIndex / (steps.length - 1)) * 100)}%` }}
                    ></div>
                    
                    <div className="relative z-10 flex justify-between">
                      {steps.map((step, index) => (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 transition-colors duration-500 ${index <= activeIndex ? 'bg-forest border-forest' : 'bg-white border-wood/20'}`}></div>
                          <span className={`text-[10px] sm:text-xs font-medium hidden sm:block ${index <= activeIndex ? 'text-forest' : 'text-wood/50'}`}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-wood/60 text-center pt-2">
                  Estimated Prep: 24–48 hrs | Estimated Delivery: 3–5 business days.
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}