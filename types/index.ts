// Amenity type
export interface Amenity {
  _id: string;
  value: string;
  label: string;
  icon?: string;
  order?: number;
}

// Property types
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface GeoPoint {
  lat?: number;
  lng?: number;
}

export interface SanityImage {
  asset: {
    _id: string;
    url: string | null;
    metadata: {
      lqip: string | null;
      dimensions: {
        width?: number | null;
        height?: number | null;
        aspectRatio?: number | null;
      } | null;
    } | null;
  } | null;
  alt?: string | null;
}

export interface Property {
  _id: string;
  title: string | null;
  description?: string | null;
  slug: string | null;
  price: number | null;
  originalPrice?: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType?: string | null;
  status?: string | null;
  squareFeet: number | null;
  yearBuilt?: number | null;
  lotSize?: number | null;
  address: Address | null;
  image: SanityImage | null;
  images?: SanityImage[] | null;
  location: GeoPoint | null;
  amenities?: Array<string>;
  openHouseDate?: string;
  createdAt?: string;
  agent?: Agent;
}

export interface Agent {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  photo?: SanityImage;
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
  name?: string;
  email?: string;
  phone?: string;
  photo?: SanityImage;
  createdA?: string;
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
