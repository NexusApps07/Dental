"use client";

import { useEffect, useState } from "react";

export default function HeroTitle() {
  const [businessName, setBusinessName] = useState("Nexus Master Lab"); // Default Text

  useEffect(() => {
    // 1. Safety Check
    if (typeof window === "undefined") return;

    // 2. Get the slug from URL (e.g., "island-dog-pet-wash")
    const path = window.location.pathname;
    const slug = path.split("/").filter(Boolean)[0];

    if (slug) {
      // 3. Convert "island-dog-pet-wash" -> "Island Dog Pet Wash"
      const formattedName = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      setBusinessName(formattedName);
    }
  }, []);

  // Returns the text inside the same style tag you likely have
  return (
    <span className="uppercase tracking-tighter">
      {businessName}
    </span>
  );
}
