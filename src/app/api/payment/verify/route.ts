import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const supabase = getServiceSupabase();

    if (expectedSignature !== razorpay_signature) {
      await supabase
        .from("orders")
        .update({ payment_status: "Failed" })
        .eq("id", orderId);

      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Payment Verified -> Update Order & Decrement Stock
    await supabase
      .from("orders")
      .update({
        payment_status: "Paid",
        status: "Payment Confirmed",
        razorpay_payment_id,
      })
      .eq("id", orderId);

    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    if (items) {
      for (const item of items) {
        const { data: prod } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();
        if (prod) {
          await supabase
            .from("products")
            .update({ stock: Math.max(0, prod.stock - item.quantity) })
            .eq("id", item.product_id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}