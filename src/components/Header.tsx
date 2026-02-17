"use client"; // This must be at the top

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [businessName, setBusinessName] = useState("Loading...");

  useEffect(() => {
    // 1. Get the current URL path
    const path = window.location.pathname;
    
    // 2. Extract the repo name (the part after the domain)
    // Example: "/island-dog-pet-wash/" -> "island-dog-pet-wash"
    const slug = path.split("/").filter(Boolean)[0];

    if (slug) {
      // 3. Format it: "island-dog-pet-wash" -> "Island Dog Pet Wash"
      const formattedName = slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      setBusinessName(formattedName);
    } else {
      setBusinessName("Nexus Portal"); // Fallback for localhost
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* The Smart Business Name */}
        <h1 className="font-serif text-xl text-white tracking-wide">
          {businessName}
        </h1>

        {/* Menu Icon (Optional) */}
        <button className="p-2 text-white/80 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
