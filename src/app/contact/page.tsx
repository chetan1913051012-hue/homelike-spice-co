"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 text-center">
      <h1 className="text-3xl font-bold text-wood">Contact Us</h1>
      <p className="text-wood/80">Have questions about our spices? We're here to help.</p>
      
      <div className="bg-white p-8 rounded-2xl border border-wood/10 space-y-6 shadow-sm mt-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="bg-parchment p-3 rounded-full mb-2">
            <Mail className="w-6 h-6 text-forest" />
          </div>
          <h3 className="font-bold text-wood">Email</h3>
          <p className="text-wood/80">{settings?.support_email || "Loading..."}</p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 pt-6 border-t border-wood/10">
          <div className="bg-parchment p-3 rounded-full mb-2">
            <Phone className="w-6 h-6 text-forest" />
          </div>
          <h3 className="font-bold text-wood">Phone</h3>
          <p className="text-wood/80">{settings?.support_phone || "Loading..."}</p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 pt-6 border-t border-wood/10">
          <div className="bg-parchment p-3 rounded-full mb-2">
            <MapPin className="w-6 h-6 text-forest" />
          </div>
          <h3 className="font-bold text-wood">Location</h3>
          <p className="text-wood/80">New Delhi, India</p>
        </div>
      </div>
    </div>
  );
}