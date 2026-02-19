import { SanityImageDimensions } from "@/sanity.types";

// Amenity type
export interface Amenity {
  _id: string;
  value: string | null;
  label: string | null;
  icon?: string | null;
  order?: number;
}

// Property types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface SanityImage {
  asset: {
    _id: string;
    url: string | null;
    metadata: {
      lqip: string | null;
      dimensions: SanityImageDimensions | null;
    } | null;
  } | null;
  alt: string | null;
}

export interface Property {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  price: number;
  originalPrice: number;
  bedrooms: number;
  bathrooms: number;
  propertyType?: string;
  status?: string;
  squareFeet: number;
  yearBuilt: number;
  lotSize: number;
  address: Address;
  image: SanityImage;
  location: GeoPoint;
  amenities: Array<string>;
  openHouseDate: string;
  createdAt: string;
}

export interface Agent {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  bio?: string;
  licenseNumber?: string;
  agency?: string;
  onboardingComplete?: boolean;
  createdAt?: string;
}

export interface Lead {
  _id: string;
  property: {
    _id: string;
    title: string;
    slug: string;
  };
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export interface User {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  phone?: string;
  photo?: SanityImage;
  savedListings?: Property[];
  createdAt: string;
}

// Form data types
export interface UserOnboardingData {
  name: string;
  phone: string;
  email: string;
  photo?: SanityImage;
}

export interface AgentOnboardingData {
  bio: string;
  photo?: SanityImage;
  licenseNumber: string;
  agency?: string;
  phone: string;
}

export interface UserProfileData {
  name: string;
  phone: string;
  photo?: SanityImage;
}

export interface AgentProfileData {
  bio: string;
  photo?: SanityImage;
  licenseNumber?: string;
  agency?: string;
  phone: string;
}

export interface ListingFormData {
  title: string;
  description: string;
  price: number;
  propertType: "house" | "apartment" | "condo" | "townhouse" | "land";
  status?: "active" | "pending" | "sold";
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt?: number;
  address: Address;
  location?: GeoPoint;
  images?: SanityImage[];
  amenities?: string[];
}

// Search params
export interface PropertySearchParams {
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  type?: string;
  city?: string;
  page?: number;
}
