export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const titles: Record<string, string> = {
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    shipping: "Shipping Policy",
    refunds: "Return & Refund Policy",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-bold text-wood">{titles[slug] || "Policy"}</h1>
      <div className="bg-white p-8 rounded-2xl border border-wood/10 space-y-4 text-sm text-wood/80 leading-relaxed">
        <p><strong>Homelike Spice Co.</strong> (New Delhi, India) is committed to complete transparency and customer trust.</p>
        {slug === "shipping" && (
          <p>Orders are prepared within an estimated 24–48 hours. Delivery after dispatch takes an estimated 3–5 business days across India. Please note that delivery times are estimates and may vary by location.</p>
        )}
        {slug === "refunds" && (
          <p>Because spices are food items, opened pouches cannot be returned. However, if you receive a damaged, defective, or incorrect pack, please contact our support email within 48 hours of delivery with photos for a prompt replacement or full refund.</p>
        )}
        {slug === "privacy" && (
          <p>We collect only the customer details (name, email, phone, and shipping address) necessary to fulfill your orders and never sell your personal data to third parties. Payments are processed securely via Razorpay.</p>
        )}
        {slug === "terms" && (
          <p>By placing an order on Homelike Spice Co., you agree to provide accurate delivery information. All product weights (50 g) and prices in INR are clearly displayed prior to checkout.</p>
        )}
      </div>
    </div>
  );
}