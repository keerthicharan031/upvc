/* OUTLOOK ENTERPRISES - Data Store */

const UPVC_DATA = {
  products: [
    {
      id: "win-01",
      name: "Ultra-Quiet Sliding Window",
      category: "windows",
      tag: "Best Seller",
      badgeClass: "badge-blue",
      pricePerSqFt: 450,
      image: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=800&q=80",
      description: "Multi-track sliding UPVC window system with reinforced steel cores and dust-proof EPDM weather gaskets.",
      specs: ["42 dB Noise Reduction", "Double Glazed 24mm", "Multi-Point Lock", "10 Year Warranty"],
      colors: ["White", "Dark Walnut", "Anthracite Grey"]
    },
    {
      id: "win-02",
      name: "European Tilt & Turn Window",
      category: "windows",
      tag: "Thermal Tech",
      badgeClass: "badge-green",
      pricePerSqFt: 580,
      image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80",
      description: "Dual-action German engineered window that tilts inward for micro-ventilation and opens 90 degrees for easy cleaning.",
      specs: ["Uw = 1.1 W/m²K", "Triple Glazed Option", "High Wind Resistance", "Air-tight Seal"],
      colors: ["Golden Oak", "Jet Black", "White"]
    },
    {
      id: "win-03",
      name: "Classic Casement Arch Window",
      category: "windows",
      tag: "Architectural",
      badgeClass: "badge-gold",
      pricePerSqFt: 620,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      description: "Custom arched top casement window providing maximum daylight, classical aesthetics, and storm proofing.",
      specs: ["Custom Curvature", "Toughened Safety Glass", "Brass/Chrome Hardware", "UV Protection"],
      colors: ["White", "Mahogany", "Dark Walnut"]
    },
    {
      id: "door-01",
      name: "Heavy-Duty Lift & Slide Patio Door",
      category: "doors",
      tag: "Luxury Living",
      badgeClass: "badge-gold",
      pricePerSqFt: 750,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      description: "Massive span sliding doors featuring effortless fingertip operation, flush low-threshold track, and panoramic views.",
      specs: ["Spans up to 6 Meters", "300kg Sash Load", "Acoustic Glazing", "Multi-layer Lock"],
      colors: ["Anthracite Grey", "Jet Black", "Dark Walnut"]
    },
    {
      id: "door-02",
      name: "Royal French Balcony Door",
      category: "doors",
      tag: "Classic Elegance",
      badgeClass: "badge-blue",
      pricePerSqFt: 520,
      image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
      description: "Double leaf outward opening French doors with decorative Georgian bars, multi-point shootbolts, and threshold seal.",
      specs: ["Dual Sash Opening", "Anti-Burglary Locks", "Low-E Glazing", "Water Tightness Class 9A"],
      colors: ["White", "Golden Oak", "Mahogany"]
    },
    {
      id: "door-03",
      name: "Bi-Fold Multi-Slide Door System",
      category: "doors",
      tag: "Panoramic",
      badgeClass: "badge-green",
      pricePerSqFt: 880,
      image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
      description: "Concertina folding doors that stack neatly to one side, completely seamless integration of indoor and outdoor space.",
      specs: ["Concealed Hinges", "Stainless Steel Rollers", "99% UV Block", "Custom Panel Counts"],
      colors: ["Anthracite Grey", "Jet Black", "White"]
    },
    {
      id: "part-01",
      name: "Acoustic Glass Office Partition",
      category: "partitions",
      tag: "Commercial",
      badgeClass: "badge-blue",
      pricePerSqFt: 490,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      description: "Sound-isolating modular UPVC room dividers designed for executive conference rooms and quiet home offices.",
      specs: ["48 dB Sound Isolation", "Frosted/Smart Glass", "Integrated Blind System", "Slim Profile"],
      colors: ["White", "Anthracite Grey"]
    }
  ],

  profileColors: [
    { id: "white", name: "Classic White", hex: "#ffffff", border: "#cbd5e1", baseCostMultiplier: 1.0 },
    { id: "walnut", name: "Dark Walnut", hex: "#3d2314", border: "#27150a", baseCostMultiplier: 1.15 },
    { id: "oak", name: "Golden Oak", hex: "#8c5627", border: "#5c3718", baseCostMultiplier: 1.15 },
    { id: "anthracite", name: "Anthracite Grey", hex: "#334155", border: "#1e293b", baseCostMultiplier: 1.12 },
    { id: "black", name: "Jet Black", hex: "#0f172a", border: "#020617", baseCostMultiplier: 1.18 }
  ],

  glassTypes: [
    { id: "single", name: "Single Toughened (6mm)", factor: 1.0, desc: "Standard safety glass" },
    { id: "double", name: "Double Glazed DGU (24mm)", factor: 1.25, desc: "Optimal sound & thermal insulation" },
    { id: "low-e", name: "Low-E Thermal Shield", factor: 1.40, desc: "Reflects heat, saves up to 40% AC bill" },
    { id: "tinted", name: "Reflective Solar Tint", factor: 1.20, desc: "Privacy & glare reduction" },
    { id: "frosted", name: "Frosted Satin Glass", factor: 1.15, desc: "100% privacy light diffusion" }
  ],

  hardwareOptions: [
    { id: "std-lock", name: "Standard Single Lock", price: 0 },
    { id: "multi-lock", name: "German Multi-Point Shootbolt", price: 1500 },
    { id: "smart-lock", name: "Digital Biometric Smart Handle", price: 4500 }
  ],

  projects: [
    {
      title: "Executive Villa Sliding Doors",
      location: "Adambakkam, Chennai",
      category: "Residential",
      image: "public/projects/residential-sliding-doors.jpg",
      details: "Heavy-duty 3-panel UPVC sliding glass doors with integrated stainless steel insect mesh screen."
    },
    {
      title: "Royal Woodgrain Arch Window",
      location: "Anna Nagar, Chennai",
      category: "Residential",
      image: "public/projects/residential-arch-walnut.jpg",
      details: "Custom German Dark Walnut laminated arch top UPVC sliding window with double glazed acoustic glass."
    },
    {
      title: "Heritage Georgian Arch Window",
      location: "ECR Beach Villa, Chennai",
      category: "Residential",
      image: "public/projects/residential-arch-casement.jpg",
      details: "Classical white arched casement window with Georgian colonial grid bars and decorative arch framing."
    },
    {
      title: "Grand Horizon Residences",
      location: "Velachery, Chennai",
      category: "Residential",
      image: "public/projects/residential-apartment-complex.jpg",
      details: "Complete multi-storey residential complex fitted with soundproof white UPVC sliding windows & balcony doors."
    },
    {
      title: "Outlook Corporate HQ Partition",
      location: "Guindy Industrial Estate, Chennai",
      category: "Commercial",
      image: "public/projects/commercial-office-partition.jpg",
      details: "Modular commercial UPVC acoustic partition cubicles with custom privacy film and heavy-duty casement door."
    }
  ],

  initialLeads: [
    { id: "LD-9041", name: "Vikram Reddy", phone: "+91 98765 43210", product: "Lift & Slide Door", area: "450 sq ft", value: "₹ 3,37,500", status: "New", date: "Today" },
    { id: "LD-9040", name: "Dr. Ananya Rao", phone: "+91 99887 76655", product: "Tilt & Turn Windows", area: "220 sq ft", value: "₹ 1,40,800", status: "Site Visit Scheduled", date: "Yesterday" },
    { id: "LD-9039", name: "GVK Constructions", phone: "+91 94400 11223", product: "Acoustic Partitions", area: "1,200 sq ft", value: "₹ 6,48,000", status: "Quote Sent", date: "23 Jul 2026" },
    { id: "LD-9038", name: "Srinivas Sharma", phone: "+91 97001 22334", product: "French Balcony Door", area: "180 sq ft", value: "₹ 1,02,600", status: "Won / Order Confirmed", date: "21 Jul 2026" }
  ]
};
