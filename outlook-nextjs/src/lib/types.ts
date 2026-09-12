// Outlook Enterprises — TypeScript Interfaces

export interface Product {
  id: string;
  name: string;
  category: 'windows' | 'doors' | 'partitions';
  tag: string;
  badgeClass: 'badge-blue' | 'badge-green' | 'badge-gold';
  pricePerSqFt: number;
  image: string;
  description: string;
  specs: string[];
  colors: string[];
}

export interface Project {
  title: string;
  location: string;
  category: 'Residential' | 'Commercial';
  image: string;
  details: string;
  productUsed?: string;
  area?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Quoted' | 'Confirmed';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  product: string;
  area: string;
  value: string;
  status: LeadStatus;
  date: string;
  notes?: string;
  created_at?: string;
  source?: 'Web Calculator' | 'WhatsApp' | 'Architect Referral' | 'Visualizer' | 'Direct Enquiry' | string;
  config?: VisualizerConfig | CalculatorConfig;
}

export interface VisualizerConfig {
  systemType: string;
  finish: string;
  glass: string;
  grill: string;
  mesh: boolean;
  estimatedPrice: number;
}

export interface CalculatorConfig {
  width: number;
  height: number;
  qty: number;
  systemType: string;
  systemName: string;
  color: string;
  glass: string;
  lock: string;
  mesh: boolean;
  totalArea: number;
  distance: number;
  material: number;
  installation: number;
  transport: number;
  gst: number;
  total: number;
}

export interface ProfileColor {
  id: string;
  name: string;
  hex: string;
  border: string;
  baseCostMultiplier: number;
}

export interface GlassType {
  id: string;
  name: string;
  factor: number;
  desc: string;
}

export interface HardwareOption {
  id: string;
  name: string;
  price: number;
}

export interface EnquiryFormData {
  name: string;
  phone: string;
  product: string;
  notes: string;
}

export interface MonthlyData {
  month: string;
  value: number;
}

export interface LeadSourceData {
  name: string;
  value: number;
  color: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number; // 1 to 5
  product: string;
  comment: string;
  date: string;
  verified?: boolean;
  avatarBg?: string;
  created_at?: string;
}

