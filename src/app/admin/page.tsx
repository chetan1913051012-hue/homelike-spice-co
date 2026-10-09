"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { PlusCircle, Trash2 } from "lucide-react";

const ORDER_STATUSES = [
  "Order Placed",
  "Payment Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const [settings, setSettings] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  const [creating, setCreating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    pack_size: "50 g",
    price: "",
    stock: "100",
    image_url: "",
  });

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setIsAdmin(false);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      setIsAdmin(false);
      return;
    }

    setIsAdmin(true);
    
    const { data: setts } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    setSettings(setts);

    const { data: prods } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    const { data: ords } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    setProducts(prods || []);
    setOrders(ords || []);
  }

  function generateSlug(name: string, packSize: string) {
    return `${name}-${packSize}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function uploadImageToSupabase(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `spice-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    try {
      let finalImageUrl = newProduct.image_url.trim();

      if (imageFile) {
        finalImageUrl = await uploadImageToSupabase(imageFile);
      }

      if (!finalImageUrl) {
        alert("Please upload a product image or paste an image URL.");
        setCreating(false);
        return;
      }

      const finalSlug =
        newProduct.slug.trim() ||
        generateSlug(newProduct.name, newProduct.pack_size);

      const { error } = await supabase.from("products").insert({
        name: newProduct.name.trim(),
        slug: finalSlug,
        tagline: newProduct.tagline.trim(),
        description: newProduct.description.trim(),
        pack_size: newProduct.pack_size.trim(),
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        image_url: finalImageUrl,
        is_active: true,
      });

      if (error) throw error;

      alert("New spice product added to your store!");
      setNewProduct({
        name: "",
        slug: "",
        tagline: "",
        description: "",
        pack_size: "50 g",
        price: "",
        stock: "100",
        image_url: "",
      });
      setImageFile(null);
      checkAdminAndLoad();
    } catch (err: any) {
      alert(err.message || "Failed to add product");
    } finally {
      setCreating(false);
    }
  }

  async function updateProduct(product: any, newFile?: File | null) {
    try {
      let updatedImageUrl = product.image_url;
      if (newFile) {
        updatedImageUrl = await uploadImageToSupabase(newFile);
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: product.name,
          pack_size: product.pack_size,
          tagline: product.tagline,
          description: product.description,
          price: Number(product.price),
          stock: Number(product.stock),
          image_url: updatedImageUrl,
          is_active: product.is_active,
        })
        .eq("id", product.id);

      if (error) throw error;
      alert(`Updated ${product.name}!`);
      checkAdminAndLoad();
    } catch (err: any) {
      alert(err.message || "Failed to update product");
    }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert(error.message);
    else checkAdminAndLoad();
  }

  async function updateOrderStatus(id: string, status: string) {
    await supabase.from("orders").update({ status }).eq("id", id);
    checkAdminAndLoad();
  }

  async function saveSettings() {
    setSavingSettings(true);
    const { error } = await supabase.from("site_settings").update(settings).eq("id", 1);
    if (error) alert("Error saving settings: " + error.message);
    else alert("Website settings updated successfully!");
    setSavingSettings(false);
  }

  if (isAdmin === null)
    return <div className="p-12 text-center">Checking permissions...</div>;
  if (isAdmin === false)
    return (
      <div className="p-12 text-center text-chilli font-bold">
        Access Denied. Administrator permissions required.
      </div>
    );

  const totalRevenue = orders
    .filter((o) => o.payment_status === "Paid" || o.status === "Delivered")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-wood">
            Homelike Spice Co. — Admin Dashboard
          </h1>
          <p className="text-sm text-wood/75">
            Manage your spices, upload product photos, and update customer orders.
          </p>
        </div>
        <div className="bg-parchment px-6 py-3 rounded-xl border border-wood/10">
          <span className="text-xs text-wood/70 block">
            Confirmed / Delivered Revenue
          </span>
          <span className="text-2xl font-bold text-forest">
            ₹{totalRevenue.toFixed(2)}
          </span>
        </div>
      </div>

      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-wood/10 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <PlusCircle className="w-6 h-6 text-forest" />
          <h2 className="text-xl font-bold text-wood">Add New Spice Product</h2>
        </div>

        <form
          onSubmit={handleCreateProduct}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <label className="text-xs font-semibold text-wood block mb-1">
              Product Name *
            </label>
            <input
              required
              placeholder="e.g., Garam Masala Powder"
              value={newProduct.name}
              onChange={(e) => {
                const name = e.target.value;
                setNewProduct({
                  ...newProduct,
                  name,
                  slug: generateSlug(name, newProduct.pack_size),
                });
              }}
              className="w-full border border-wood/20 rounded-lg px-3.5 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-wood block mb-1">
                Pack Size *
              </label>
              <input
                required
                placeholder="50 g"
                value={newProduct.pack_size}
                onChange={(e) => {
                  const pack_size = e.target.value;
                  setNewProduct({
                    ...newProduct,
                    pack_size,
                    slug: generateSlug(newProduct.name, pack_size),
                  });
                }}
                className="w-full border border-wood/20 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-wood block mb-1">
                Price (₹) *
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="85"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="w-full border border-wood/20 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-wood block mb-1">
                Initial Stock *
              </label>
              <input
                required
                type="number"
                placeholder="100"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="w-full border border-wood/20 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-wood block mb-1">
              Short Tagline (Shown on Product Card) *
            </label>
            <input
              required
              placeholder="e.g., Rich, aromatic blend of whole roasted spices."
              value={newProduct.tagline}
              onChange={(e) =>
                setNewProduct({ ...newProduct, tagline: e.target.value })
              }
              className="w-full border border-wood/20 rounded-lg px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-wood block mb-1">
              URL Slug (Auto-generated)
            </label>
            <input
              required
              placeholder="garam-masala-powder-50-g"
              value={newProduct.slug}
              onChange={(e) =>
                setNewProduct({ ...newProduct, slug: e.target.value })
              }
              className="w-full border border-wood/20 rounded-lg px-3.5 py-2 text-sm bg-cream"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-wood block mb-1">
              Full Product Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the aroma, sourcing, and culinary uses..."
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className="w-full border border-wood/20 rounded-lg px-3.5 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2 bg-parchment/60 p-4 rounded-xl border border-wood/10 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-wood block mb-1.5">
                Option 1: Upload Product Photo from Computer
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-wood file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-forest file:text-white hover:file:bg-forest/90"
              />
              {imageFile && (
                <p className="text-xs text-forest mt-1 font-medium">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-wood block mb-1.5">
                Option 2: Or Paste Direct Image URL
              </label>
              <input
                placeholder="https://..."
                value={newProduct.image_url}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image_url: e.target.value })
                }
                className="w-full border border-wood/20 bg-white rounded-lg px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              disabled={creating}
              type="submit"
              className="bg-forest text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-forest/90 transition disabled:opacity-50"
            >
              {creating ? "Uploading & Saving..." : "Add Spice to Store"}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-wood/10 shadow-sm">
        <h2 className="text-xl font-bold text-wood mb-6">
          Manage Existing Products ({products.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="p-4 border border-wood/15 rounded-2xl space-y-3 flex flex-col justify-between bg-cream/40"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-parchment border border-wood/10">
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-wood/80 block mb-1">
                    Replace Product Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) updateProduct(p, file);
                    }}
                    className="block w-full text-xs text-wood file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-turmeric/30 file:text-wood hover:file:bg-turmeric/40"
                  />
                </div>

                <div>
                  <label className="text-xs text-wood/70 block">Name</label>
                  <input
                    defaultValue={p.name}
                    onChange={(e) => (p.name = e.target.value)}
                    className="w-full border rounded-lg px-3 py-1.5 text-sm bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-wood/70 block">Pack</label>
                    <input
                      defaultValue={p.pack_size}
                      onChange={(e) => (p.pack_size = e.target.value)}
                      className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-wood/70 block">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={p.price}
                      onChange={(e) => (p.price = Number(e.target.value))}
                      className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-wood/70 block">Stock</label>
                    <input
                      type="number"
                      defaultValue={p.stock}
                      onChange={(e) => (p.stock = Number(e.target.value))}
                      className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-wood/70 block">Tagline</label>
                  <input
                    defaultValue={p.tagline}
                    onChange={(e) => (p.tagline = e.target.value)}
                    className="w-full border rounded-lg px-3 py-1.5 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-wood/10">
                <button
                  onClick={() => updateProduct(p)}
                  className="flex-1 bg-forest text-white py-2 rounded-lg text-xs font-semibold hover:bg-forest/90 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => deleteProduct(p.id, p.name)}
                  className="p-2 text-chilli border border-chilli/20 rounded-lg hover:bg-chilli/10 transition"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-wood/10 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-wood">
            Orders ({filteredOrders.length})
          </h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="All">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 border border-wood/10 rounded-xl flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="font-bold text-wood">
                  {order.order_number} — ₹{order.total_amount} (
                  {order.payment_status})
                </p>
                <p className="text-sm text-wood/80">
                  {order.customer_name} | {order.customer_phone} |{" "}
                  {order.customer_email}
                </p>
                <p className="text-xs text-wood/70">
                  {order.shipping_address}, {order.city}, {order.state} -{" "}
                  {order.pin_code}
                </p>
                {order.order_items && order.order_items.length > 0 && (
                  <p className="text-xs font-medium text-forest pt-1">
                    Items:{" "}
                    {order.order_items
                      .map(
                        (i: any) =>
                          `${i.product_name} (${i.pack_size}) x${i.quantity}`
                      )
                      .join(", ")}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm font-medium bg-cream"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      {settings && (
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-wood/10 shadow-sm mt-12">
          <h2 className="text-xl font-bold text-wood mb-6">Website Settings & Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-wood block mb-1">Support Email</label>
              <input value={settings.support_email} onChange={(e) => setSettings({...settings, support_email: e.target.value})} className="w-full border rounded-lg px-3.5 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-wood block mb-1">Support Phone</label>
              <input value={settings.support_phone} onChange={(e) => setSettings({...settings, support_phone: e.target.value})} className="w-full border rounded-lg px-3.5 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-wood block mb-1">Delivery Charge (₹)</label>
              <input type="number" value={settings.delivery_charge} onChange={(e) => setSettings({...settings, delivery_charge: Number(e.target.value)})} className="w-full border rounded-lg px-3.5 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-wood block mb-1">Free Shipping Threshold (₹)</label>
              <input type="number" value={settings.free_shipping_threshold} onChange={(e) => setSettings({...settings, free_shipping_threshold: Number(e.target.value)})} className="w-full border rounded-lg px-3.5 py-2 text-sm" />
            </div>
          </div>
          <button onClick={saveSettings} disabled={savingSettings} className="mt-6 bg-forest text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-forest/90 transition disabled:opacity-50">
            {savingSettings ? "Saving..." : "Save Website Settings"}
          </button>
        </section>
      )}
    </div>
  );
}