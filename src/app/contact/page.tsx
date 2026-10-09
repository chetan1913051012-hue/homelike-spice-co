"use client";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-wood">Contact Us</h1>
        <p className="text-wood/80">Have a question about your order or our spices? Reach out to our team in New Delhi.</p>
        <div className="bg-parchment p-6 rounded-2xl space-y-2 text-sm">
          <p><strong>Location:</strong> New Delhi, India</p>
          <p><strong>Support Email:</strong> [Insert Official Support Email]</p>
          <p><strong>Phone / WhatsApp:</strong> [Insert Support Phone Number]</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="bg-white p-6 rounded-2xl border border-wood/10 space-y-4">
        <h2 className="text-xl font-bold text-wood">Send a Message</h2>
        {submitted ? (
          <p className="text-forest font-medium">Thank you! We have received your message and will respond shortly.</p>
        ) : (
          <>
            <input required placeholder="Your Name" className="w-full border rounded-lg px-4 py-2.5" />
            <input required type="email" placeholder="Your Email" className="w-full border rounded-lg px-4 py-2.5" />
            <textarea required placeholder="How can we help?" rows={4} className="w-full border rounded-lg px-4 py-2.5" />
            <button type="submit" className="w-full bg-forest text-white py-3 rounded-full font-semibold">Send Message</button>
          </>
        )}
      </form>
    </div>
  );
}