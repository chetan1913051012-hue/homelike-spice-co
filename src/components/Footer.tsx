import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-parchment border-t border-wood/10 text-wood mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="relative h-24 w-24 mb-4 rounded-full overflow-hidden border-2 border-wood/10 shadow-sm bg-white">
            <Image
              src="/logo.png"
              alt="Homelike Spice Co. Official Logo"
              fill
              className="object-contain"
            />
          </div>
          <p className="font-bold text-lg">Homelike Spice Co.</p>
          <p className="text-sm text-forest italic mb-2">&ldquo;Ghar jaisa swaad&rdquo;</p>
          <p className="text-sm text-wood/80">New Delhi, India</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-wood">Explore</h4>
          <ul className="space-y-2 text-sm text-wood/80">
            <li><Link href="/shop" className="hover:text-forest">Shop Spices</Link></li>
            <li><Link href="/story" className="hover:text-forest">Our Story</Link></li>
            <li><Link href="/contact" className="hover:text-forest">Contact Us</Link></li>
            <li><Link href="/account" className="hover:text-forest">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-wood">Policies</h4>
          <ul className="space-y-2 text-sm text-wood/80">
            <li><Link href="/policies/privacy" className="hover:text-forest">Privacy Policy</Link></li>
            <li><Link href="/policies/terms" className="hover:text-forest">Terms & Conditions</Link></li>
            <li><Link href="/policies/shipping" className="hover:text-forest">Shipping Policy</Link></li>
            <li><Link href="/policies/refunds" className="hover:text-forest">Return & Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-wood">Customer Support</h4>
          <p className="text-sm text-wood/80 mb-1">Location: New Delhi, India</p>
          <p className="text-sm text-wood/80 mb-1">Email: [Insert Official Support Email]</p>
          <p className="text-sm text-wood/80 mb-3">Phone: [Insert Support Phone]</p>
          <p className="text-xs text-wood/60">
            Estimated Preparation: 24–48 hrs | Estimated Delivery: 3–5 business days after dispatch.
          </p>
        </div>
      </div>
      <div className="border-t border-wood/10 py-6 text-center text-xs text-wood/60">
        © {new Date().getFullYear()} Homelike Spice Co. All rights reserved.
      </div>
    </footer>
  );
}