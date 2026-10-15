"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const getDeviceId = () => {
  if (typeof window === "undefined") return "server-fallback";
  
  let deviceId = localStorage.getItem("hls_device_id");
  if (!deviceId) {
    // Generates a unique string like "guest_8f7d9a..."
    deviceId = `guest_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("hls_device_id", deviceId);
  }
  return deviceId;
};

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  pack_size: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">, qty: number) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const deviceId = getDeviceId();
    const saved = localStorage.getItem(`homelike_cart_${deviceId}`);
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const deviceId = getDeviceId();
    localStorage.setItem(`homelike_cart_${deviceId}`, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Omit<CartItem, "quantity">, qty: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};