// Outlook Enterprises — Seed Data Store
import type { Product, Project, Lead, ProfileColor, GlassType, HardwareOption, MonthlyData, LeadSourceData, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'win-01',
    name: 'Ultra-Quiet Sliding Window',
    category: 'windows',
    tag: 'Best Seller',
    badgeClass: 'badge-blue',
    pricePerSqFt: 450,
    image: 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=800&q=80',
    description: 'Multi-track sliding UPVC window system with reinforced steel cores and dust-proof EPDM weather gaskets.',
    specs: ['42 dB Noise Reduction', 'Double Glazed 24mm', 'Multi-Point Lock', '10 Year Warranty'],
    colors: ['White', 'Dark Walnut', 'Anthracite Grey'],
  },
  {
    id: 'win-02',
    name: 'European Tilt & Turn Window',
    category: 'windows',
    tag: 'Thermal Tech',
    badgeClass: 'badge-green',
    pricePerSqFt: 580,
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    description: 'Dual-action German engineered window that tilts inward for micro-ventilation and opens 90° for easy cleaning.',
    specs: ['Uw = 1.1 W/m²K', 'Triple Glazed Option', 'High Wind Resistance', 'Air-tight Seal'],
    colors: ['Golden Oak', 'Jet Black', 'White'],
  },
  {
    id: 'win-03',
    name: 'Classic Casement Arch Window',
    category: 'windows',
    tag: 'Architectural',
    badgeClass: 'badge-gold',
    pricePerSqFt: 620,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Custom arched top casement window providing maximum daylight, classical aesthetics, and storm proofing.',
    specs: ['Custom Curvature', 'Toughened Safety Glass', 'Brass/Chrome Hardware', 'UV Protection'],
    colors: ['White', 'Mahogany', 'Dark Walnut'],
  },
  {
    id: 'door-01',
    name: 'Heavy-Duty Lift & Slide Patio Door',
    category: 'doors',
    tag: 'Luxury Living',
    badgeClass: 'badge-gold',
    pricePerSqFt: 750,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    description: 'Massive span sliding doors featuring effortless fingertip operation, flush low-threshold track, and panoramic views.',
    specs: ['Spans up to 6 Meters', '300kg Sash Load', 'Acoustic Glazing', 'Multi-layer Lock'],
    colors: ['Anthracite Grey', 'Jet Black', 'Dark Walnut'],
  },
  {
    id: 'door-02',
    name: 'Royal French Balcony Door',
    category: 'doors',
    tag: 'Classic Elegance',
    badgeClass: 'badge-blue',
    pricePerSqFt: 520,
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    description: 'Double leaf outward opening French doors with decorative Georgian bars, multi-point shootbolts, and threshold seal.',
    specs: ['Dual Sash Opening', 'Anti-Burglary Locks', 'Low-E Glazing', 'Water Tightness Class 9A'],
    colors: ['White', 'Golden Oak', 'Mahogany'],
  },
  {
    id: 'door-03',
    name: 'Bi-Fold Multi-Slide Door System',
    category: 'doors',
    tag: 'Panoramic',
    badgeClass: 'badge-green',
    pricePerSqFt: 880,
    image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80',
    description: 'Concertina folding doors that stack neatly to one side, completely seamless integration of indoor and outdoor space.',
    specs: ['Concealed Hinges', 'Stainless Steel Rollers', '99% UV Block', 'Custom Panel Counts'],
    colors: ['Anthracite Grey', 'Jet Black', 'White'],
  },
  {
    id: 'part-01',
    name: 'Acoustic Glass Office Partition',
    category: 'partitions',
    tag: 'Commercial',
    badgeClass: 'badge-blue',
    pricePerSqFt: 490,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Sound-isolating modular UPVC room dividers designed for executive conference rooms and quiet home offices.',
    specs: ['48 dB Sound Isolation', 'Frosted/Smart Glass', 'Integrated Blind System', 'Slim Profile'],
    colors: ['White', 'Anthracite Grey'],
  },
];

export const PROJECTS: Project[] = [
  {
    title: 'Executive Villa Sliding Doors',
    location: 'Adambakkam, Chennai',
    category: 'Residential',
    image: '/projects/residential-sliding-doors.jpg',
    details: 'Heavy-duty 3-panel UPVC sliding glass doors with integrated stainless steel insect mesh screen and multi-point security locks.',
    productUsed: '3-Track Sliding Door with Insect Mesh',
    area: '2,800 sq ft',
  },
  {
    title: 'Royal Woodgrain Arch Window',
    location: 'Anna Nagar, Chennai',
    category: 'Residential',
    image: '/projects/residential-arch-walnut.jpg',
    details: 'Custom German Dark Walnut laminated arch top UPVC sliding window with double glazed acoustic glass.',
    productUsed: 'Dark Walnut Arch Top Sliding Window',
    area: '1,450 sq ft',
  },
  {
    title: 'Heritage Georgian Arch Window',
    location: 'ECR Beach Villa, Chennai',
    category: 'Residential',
    image: '/projects/residential-arch-casement.jpg',
    details: 'Classical white arched casement window with Georgian colonial grid bars and decorative architectural arch framing.',
    productUsed: 'Georgian Colonial Arch Casement',
    area: '3,200 sq ft',
  },
  {
    title: 'Grand Horizon Residences',
    location: 'Velachery, Chennai',
    category: 'Residential',
    image: '/projects/residential-apartment-complex.jpg',
    details: 'Complete multi-storey residential complex fitted with soundproof white UPVC sliding windows & balcony doors.',
    productUsed: 'Residential UPVC Windows & Balcony Doors',
    area: '18,500 sq ft',
  },
  {
    title: 'Outlook Corporate HQ Partition',
    location: 'Guindy Industrial Estate, Chennai',
    category: 'Commercial',
    image: '/projects/commercial-office-partition.jpg',
    details: 'Modular commercial UPVC acoustic partition cubicles with custom privacy film and heavy-duty casement door.',
    productUsed: 'Acoustic Commercial UPVC Partition System',
    area: '6,500 sq ft',
  },
];

export const INITIAL_LEADS: Lead[] = [
  { id: 'LD-9041', name: 'Vikram Reddy', phone: '+91 98765 43210', product: 'Lift & Slide Door', area: '450 sq ft', value: '₹ 3,37,500', status: 'New', date: 'Today', source: 'Web Calculator' },
  { id: 'LD-9040', name: 'Dr. Ananya Rao', phone: '+91 99887 76655', product: 'Tilt & Turn Windows', area: '220 sq ft', value: '₹ 1,40,800', status: 'Contacted', date: 'Yesterday', source: 'WhatsApp' },
  { id: 'LD-9039', name: 'GVK Constructions', phone: '+91 94400 11223', product: 'Acoustic Partitions', area: '1,200 sq ft', value: '₹ 6,48,000', status: 'Quoted', date: '23 Jul 2026', source: 'Architect Referral' },
  { id: 'LD-9038', name: 'Srinivas Sharma', phone: '+91 97001 22334', product: 'French Balcony Door', area: '180 sq ft', value: '₹ 1,02,600', status: 'Confirmed', date: '21 Jul 2026', source: 'Web Calculator' },
];

export const PROFILE_COLORS: ProfileColor[] = [
  { id: 'white', name: 'Classic White', hex: '#ffffff', border: '#cbd5e1', baseCostMultiplier: 1.0 },
  { id: 'walnut', name: 'Dark Walnut', hex: '#3d2314', border: '#27150a', baseCostMultiplier: 1.15 },
  { id: 'oak', name: 'Golden Oak', hex: '#8c5627', border: '#5c3718', baseCostMultiplier: 1.15 },
  { id: 'anthracite', name: 'Anthracite Grey', hex: '#334155', border: '#1e293b', baseCostMultiplier: 1.12 },
  { id: 'black', name: 'Jet Black', hex: '#0f172a', border: '#020617', baseCostMultiplier: 1.18 },
];

export const GLASS_TYPES: GlassType[] = [
  { id: 'single', name: '6mm Single Toughened', factor: 1.0, desc: 'Standard safety glass' },
  { id: 'double', name: '24mm Double Glazed DGU', factor: 1.25, desc: 'Optimal sound & thermal insulation' },
  { id: 'low-e', name: 'Low-E Thermal Shield', factor: 1.40, desc: 'Reflects heat, saves up to 40% AC bill' },
  { id: 'tinted', name: 'Solar Blue Tint', factor: 1.20, desc: 'Privacy & glare reduction' },
  { id: 'frosted', name: 'Frosted Satin Privacy', factor: 1.15, desc: '100% privacy light diffusion' },
];

export const HARDWARE_OPTIONS: HardwareOption[] = [
  { id: 'std-lock', name: 'Standard Single Lock', price: 0 },
  { id: 'multi-lock', name: 'German Multi-Point Shootbolt', price: 1500 },
  { id: 'smart-lock', name: 'Digital Biometric Smart Handle', price: 4500 },
];

export const SYSTEM_TYPES = [
  { id: 'sliding-win', name: '2-Track Sliding Window', baseRate: 450 },
  { id: 'tilt-turn', name: 'European Tilt & Turn', baseRate: 580 },
  { id: 'french-door', name: 'French Balcony Door', baseRate: 520 },
  { id: 'lift-slide', name: 'Lift & Slide Patio Door', baseRate: 750 },
  { id: 'acoustic-partition', name: 'Acoustic Glass Partition', baseRate: 490 },
];

export const GRILL_OPTIONS = [
  { id: 'none', name: 'No Grills (Clear View)' },
  { id: 'colonial', name: 'Colonial Grid' },
  { id: 'cross', name: 'Cross Bars' },
];

export const MONTHLY_DATA: MonthlyData[] = [
  { month: 'Jan', value: 420000 },
  { month: 'Feb', value: 580000 },
  { month: 'Mar', value: 510000 },
  { month: 'Apr', value: 720000 },
  { month: 'May', value: 890000 },
  { month: 'Jun', value: 1050000 },
  { month: 'Jul', value: 1220000 },
];

export const LEAD_SOURCES: LeadSourceData[] = [
  { name: 'Web Calculator', value: 48, color: '#3E7BFA' },
  { name: 'WhatsApp Inquiry', value: 32, color: '#10b981' },
  { name: 'Architect Referrals', value: 20, color: '#f59e0b' },
];

export const GST_RATE = 0.18;
export const INSTALLATION_RATE = 0.075; // 7.5% of material cost
export const MESH_COST_PER_UNIT = 800;

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'REV-101',
    name: 'K. Balasubramanian',
    location: 'Adambakkam, Chennai',
    rating: 5,
    product: '3-Track Sliding Windows with SS Mesh',
    comment: 'Installed Outlook UPVC sliding windows for our entire 3BHK flat in Adambakkam. The traffic sound reduction is unbelievable! Managing partner Durai personally supervised the measurement and installation. Extremely neat work and 100% on-time delivery.',
    date: '10 Aug 2026',
    verified: true,
    avatarBg: '#3E7BFA',
  },
  {
    id: 'REV-102',
    name: 'Dr. Radhika Sundaram',
    location: 'ECR Beach Villa, Chennai',
    rating: 5,
    product: 'German Lift & Slide Patio Doors',
    comment: 'We needed massive 12-foot glass patio doors facing the coast with high wind resistance and corrosion protection. Saravanavel and his engineering team delivered top-tier German profiles. The sliding is feather-light and completely water-tight during heavy rains.',
    date: '04 Aug 2026',
    verified: true,
    avatarBg: '#10b981',
  },
  {
    id: 'REV-103',
    name: 'M. Senthil Kumar (Architect)',
    location: 'Anna Nagar, Chennai',
    rating: 5,
    product: 'Dark Walnut Arch Top Windows',
    comment: 'As an architect, precision in custom arch templates is paramount. Outlook Enterprises executed our dark walnut woodgrain arched casement windows with flawless fusion welding and premium multi-point hardware. Outstanding craftsmanship.',
    date: '28 Jul 2026',
    verified: true,
    avatarBg: '#8b5cf6',
  },
  {
    id: 'REV-104',
    name: 'Preethi & Karthik',
    location: 'Velachery, Chennai',
    rating: 5,
    product: 'European Tilt & Turn Windows',
    comment: 'Replaced our old wooden windows with Outlook UPVC Tilt & Turn windows. The ventilation in tilt mode is great for monsoon, and when locked the room is completely soundproof from the main road. Pricing was very transparent.',
    date: '19 Jul 2026',
    verified: true,
    avatarBg: '#f59e0b',
  },
  {
    id: 'REV-105',
    name: 'G. Ramakrishnan',
    location: 'Thoraipakkam (OMR), Chennai',
    rating: 5,
    product: 'Entire House UPVC Package',
    comment: 'Honest estimation, zero hidden charges, and flawless installation within 16 days. The team cleaned up the site thoroughly after work. Highly recommend Saravanavel & Durai for any residential project in Chennai.',
    date: '11 Jul 2026',
    verified: true,
    avatarBg: '#06b6d4',
  },
  {
    id: 'REV-106',
    name: 'Anand Varma (Facility Head)',
    location: 'Guindy Industrial Estate, Chennai',
    rating: 4,
    product: 'Commercial Acoustic Partitions',
    comment: 'Fitted 6,500 sq ft of modular acoustic glass partitions in our corporate office. High structural strength, excellent finish, and completed over a single weekend with minimal disruption.',
    date: '02 Jul 2026',
    verified: true,
    avatarBg: '#ec4899',
  },
];

