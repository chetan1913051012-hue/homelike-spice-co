"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Trash2, Plus, Minus, MapPin } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin_code: "",
  });

  const deliveryCharge = subtotal >= 499 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  function handleLocateMe() {
    setLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        if (data && data.address) {
          setCustomer(prev => ({
            ...prev,
            address: data.display_name || prev.address,
            city: data.address.city || data.address.town || data.address.state_district || prev.city,
            state: data.address.state || prev.state,
            pin_code: data.address.postcode || prev.pin_code
          }));
        }
      } catch (err) {
        alert("Could not fetch address automatically. Please enter manually.");
      } finally {
        setLocating(false);
      }
    }, () => {
      alert("Location access denied. Please enter address manually.");
      setLocating(false);
    });
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(customer.pin_code)) {
      alert("Please enter a valid 6-digit Indian PIN code.");
      return;
    }
    if (!/^\d{10}$/.test(customer.phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // We automatically send "COD" as the only payment method now
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          customer,
          items,
          paymentMethod: "COD", 
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      // Clear the cart and show success screen immediately
      clearCart();
      setOrderSuccess(data.orderNumber);

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="bg-white p-8 rounded-2xl border border-wood/10 space-y-4 shadow-sm">
          <h1 className="text-3xl font-bold text-forest">Thank You for Your Order!</h1>
          <p className="text-wood">
            Your Order ID is <strong>{orderSuccess}</strong>.
          </p>
          <p className="text-sm font-medium text-wood bg-parchment py-2 px-4 rounded-lg inline-block">
            Payment Method: Cash on Delivery
          </p>
          <p className="text-sm text-wood/75">
            Estimated preparation: 24–48 hours. Estimated delivery: 3–5 business days after dispatch.
          </p>
          <div className="pt-2">
            <Link
              href="/account"
              className="inline-block bg-forest text-white px-6 py-3 rounded-full font-semibold hover:bg-forest/90 transition"
            >
              View Order Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-wood mb-8">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-wood/10 text-center space-y-4">
          <p className="text-wood/75">Your cart is currently empty.</p>
          <Link
            href="/shop"
            className="inline-block bg-forest text-white px-6 py-2.5 rounded-full font-semibold"
          >
            Browse Spices
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl border border-wood/10 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-wood">{item.name}</h3>
                  <p className="text-xs text-wood/70">
                    {item.pack_size} • ₹{item.price} each
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 border rounded"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-semibold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 border rounded"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-chilli ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-parchment p-6 rounded-xl border border-wood/10 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>₹{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-wood/10">
                <span>Total Payable</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-wood/70 pt-2">
                *Estimated preparation: 24–48 hours. Delivery: 3–5 business days after dispatch.
              </p>
            </div>
          </div>

          {/* Checkout Form */}
          <form
            onSubmit={handleCheckout}
            className="bg-white p-6 rounded-2xl border border-wood/10 space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-wood">Delivery Details</h2>
              <button 
                type="button" 
                onClick={handleLocateMe}
                disabled={locating}
                className="flex items-center gap-1.5 text-xs font-semibold bg-forest/10 text-forest px-3 py-1.5 rounded-full hover:bg-forest/20 transition"
              >
                <MapPin className="w-3.5 h-3.5" />
                {locating ? "Locating..." : "Auto-Detect Address"}
              </button>
            </div>

            <input
              required
              placeholder="Full Name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2.5"
            />
            <input
              required
              type="email"
              placeholder="Email Address"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2.5"
            />
            <input
              required
              placeholder="10-Digit Mobile Number"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              className="w-full border rounded-lg px-4 py-2.5"
            />
            <textarea
              required
              placeholder="Full Street Address & Landmark"
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              className="w-full border rounded-lg px-4 py-2.5"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                required
                placeholder="City"
                value={customer.city}
                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                required
                placeholder="State"
                value={customer.state}
                onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                required
                placeholder="PIN Code"
                value={customer.pin_code}
                onChange={(e) => setCustomer({ ...customer, pin_code: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-forest text-white py-3.5 rounded-full font-semibold hover:bg-forest/90 transition mt-4"
            >
              {loading
                ? "Processing Order..."
                : `Place COD Order (₹${total.toFixed(2)})`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}