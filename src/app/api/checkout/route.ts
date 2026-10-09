import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServiceSupabase } from "@/lib/supabase";
import { Resend } from "resend"; // 1. Added Resend import

// 2. Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, customer, items, paymentMethod = "ONLINE" } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // 1. Verify real product prices & stock from DB
    const productIds = items.map((i: any) => i.id);
    const { data: dbProducts, error: prodErr } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (prodErr || !dbProducts) {
      return NextResponse.json({ error: "Unable to verify products" }, { status: 500 });
    }

    let calculatedSubtotal = 0;
    for (const item of items) {
      const dbProd = dbProducts.find((p) => p.id === item.id);
      if (!dbProd || dbProd.stock < item.quantity) {
        return NextResponse.json(
          { error: `${item.name} is out of stock or insufficient quantity.` },
          { status: 400 }
        );
      }
      calculatedSubtotal += Number(dbProd.price) * item.quantity;
    }

    // 2. Fetch configurable delivery charge
    const { data: settings } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    const deliveryCharge =
      calculatedSubtotal >= Number(settings?.free_shipping_threshold ?? 499)
        ? 0
        : Number(settings?.delivery_charge ?? 40);

    const totalAmount = calculatedSubtotal + deliveryCharge;
    const orderNumber = `HLS-${Date.now().toString().slice(-6)}`;

    // 3. Handle Online Payment vs Cash on Delivery (COD)
    let rzpOrderId: string | null = null;

    if (paymentMethod === "ONLINE") {
      const razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // in paise
        currency: "INR",
        receipt: orderNumber,
      });
      rzpOrderId = rzpOrder.id;
    }

    // 4. Save Order in Database
    const { data: newOrder, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: customer.address,
        city: customer.city,
        state: customer.state,
        pin_code: customer.pin_code,
        subtotal: calculatedSubtotal,
        delivery_charge: deliveryCharge,
        total_amount: totalAmount,
        status: "Order Placed",
        payment_status: paymentMethod === "COD" ? "COD (Pay on Delivery)" : "Pending",
        razorpay_order_id: rzpOrderId,
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    // 5. Insert Order Items
    const orderItemsPayload = items.map((item: any) => {
      const dbProd = dbProducts.find((p) => p.id === item.id)!;
      return {
        order_id: newOrder.id,
        product_id: dbProd.id,
        product_name: dbProd.name,
        pack_size: dbProd.pack_size,
        quantity: item.quantity,
        unit_price: dbProd.price,
      };
    });

    await supabase.from("order_items").insert(orderItemsPayload);

    // 6. If COD, immediately decrement product stock since order is confirmed
    if (paymentMethod === "COD") {
      for (const item of items) {
        const dbProd = dbProducts.find((p) => p.id === item.id);
        if (dbProd) {
          await supabase
            .from("products")
            .update({ stock: Math.max(0, dbProd.stock - item.quantity) })
            .eq("id", item.id);
        }
      }
    }

    // 7. NEW: Send Order Confirmation Email via Resend
    try {
      await resend.emails.send({
        from: 'Homelike Spice Co. <care@homelikespice.in>', // Make sure this matches your verified Resend domain
        to: [customer.email],
        subject: `Order Confirmed: ${orderNumber} - Your spices are on the way!`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #221C16; font-family: 'Playfair Display', serif;">Hi ${customer.name},</h1>
            <p style="color: #4a4a4a; line-height: 1.6;">Thank you for bringing the authentic taste of New Delhi into your kitchen.</p>
            
            <div style="background-color: #FDFBF7; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e5e5;">
              <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
              <p style="margin: 0 0 10px 0;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
              <p style="margin: 0;"><strong>Payment Method:</strong> ${paymentMethod === "COD" ? "Cash on Delivery" : "Online"}</p>
            </div>

            <p style="color: #4a4a4a; line-height: 1.6;">We are hand-packing your spices in our custom boxes and will ship them shortly. We will send you the Shiprocket tracking link once dispatched.</p>
            <br/>
            <p style="color: #221C16; font-weight: bold;">Ghar jaisa swaad,<br/>The Homelike Spice Co. Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // We don't throw an error here so the checkout still succeeds even if the email fails.
    }

    return NextResponse.json({
      orderId: newOrder.id,
      orderNumber,
      razorpayOrderId: rzpOrderId,
      amount: totalAmount,
      paymentMethod,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}