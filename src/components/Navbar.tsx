"use client";

import { useState, useEffect } from "react";

export default function Navbar() { // Renamed component to Navbar
  const [businessName, setBusinessName] = useState("Loading...");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    const slug = parts.length > 0 ? parts[0] : null;

    if (slug) {
      const formattedName = slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setBusinessName(formattedName);
    } else {
      setBusinessName("Nexus Portal");
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="font-serif text-xl text-white tracking-wide">
          {businessName}
        </h1>
      </div>
    </header>
  );
}
