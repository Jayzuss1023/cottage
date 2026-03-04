"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
// import { createListing, updateListing } from "@/actions/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type AddressResult } from "./AddressAutocomplete";
import { type ImageItem } from "./ImageUpload";
// import { LocationPicker } from "./LocationPicker";

const PROPERTY_TYPES = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pendng" },
  { value: "sold", label: "Sold" },
];

// Re-export Amenity type from shared types
import type { Amenity } from "@/types";
export type { Amenity };

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  propertyType: z.enum(["house", "apartment", "condo", "townhouse", "land"]),
  status: z.enum(["active", "pending", "condo", "townhouse", "land"]),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  squareFeet: z.coerce.number().min(0),
  yearBuilt: z.coerce
    .number()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  // Address fields are still stored but auto-filled from autocomplete
  street: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  amenities: z.array(z.string()).optional(),
});

// Input type: What the form fields receive (strings from inputs)
type FormDataInput = z.input<typeof formSchema>;
// Output type: What validation produces (coerced to proper types)
type FormDataOutput = z.output<typeof formSchema>;

interface ListingImage {
  asset: {
    _id: string;
    url: string;
  };
}

interface GeoPoint {
  lat: number;
  lng: number;
}

interface ListingFormProps {
  listing?: {
    _id: string;
    title: string;
    description?: string;
    price: number;
    propertyType: string;
    status: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt?: number;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    location?: GeoPoint;
    amenities?: string[];
    images?: ListingImage[];
  };
  amenities: Amenity[];
  mode?: "create" | "edit";
}

export function ListingForm({
  listing,
  amenities,
  mode = "create",
}: ListingFormProps) {
  const [isPending, startTransition] = useTransition();

  // Initialize images from listing data
  const initialImages: ImageItem[] =
    listing?.images?.map((img) => ({
      id: img.asset._id,
      url: img.asset.url,
      assetRef: img.asset._id,
    })) || [];

  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [location, setLocation] = useState<GeoPoint | undefined>(
    listing?.location,
  );

  // Build initial address display value - Used for edit mode
  const initialAddressValue = listing?.address
    ? [
        listing.address.street,
        listing.address.city,
        listing.address.state,
        listing.address.zipCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const [addressDisplayValue, setAddressDisplayValue] =
    useState(initialAddressValue);

  const form = useForm<FormDataInput, unknown, FormDataOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: listing?.title || "",
      description: listing?.description || "",
      price: listing?.price || 0,
      propertyType:
        (listing?.propertyType as FormDataOutput["propertyType"]) || "house",
      status: (listing?.status as FormDataOutput["status"]) || "active",
      bedrooms: listing?.bedrooms || 0,
      bathrooms: listing?.bathrooms || 0,
      squareFeet: listing?.squareFeet || 0,
      yearBuilt: listing?.yearBuilt,
      street: listing?.address?.street || "",
      city: listing?.address?.city || "",
      state: listing?.address?.state || "",
      zipCode: listing?.address?.zipCode || "",
      amenities: listing?.amenities || [],
    },
  });

  // Handle address selection from autocomplete
  const handleAddressSelect = (address: AddressResult | null) => {
    if (address) {
      // Update form fields with parsed address
      form.setValue("street", address.street, { shouldValidate: true });
      form.setValue("city", address.city, { shouldValidate: true });
      form.setValue("state", address.state, { shouldValidate: true });
      form.setValue("zipCode", address.zipCode, { shouldValidate: true });
      //Update location for mat
      setLocation({ lat: address.lat, lng: address.lng });
      setAddressDisplayValue(address.formattedAddress);
    }
  };

  // Sync location picker changes back (for manual adjustments)
  const handleLocationChange = (newLocation: GeoPoint) => {
    setLocation(newLocation);
  };

  const onSubmit = (data: FormDataOutput) => {
    startTransition(async () => {
      try {
        // Convert Images to Sanity format
        const imageRefs = images
          .filter((img) => !img.isUploading && img.assetRef)
          .map((img) => ({
            _type: "image" as const,
            _key: img.id,
            asset: {
              _type: "reference" as const,
              _ref: img.assetRef,
            },
          }));

        const formData = {
          title: data.title,
          description: data.description,
          price: data.price,
          status: data.status,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          squareFeet: data.squareFeet,
          yearBuilt: data.yearBuilt,
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
          location,
          amenities: data.amenities,
          images: imageRefs,
        };

        if (mode === "edit" && listing) {
          await updateListing(listing._id, formData);
          toast.success("Listing updated successfully");
        } else {
          await createListing(formData);
          toast.success("Listing created successfully");
        }
      } catch (_error) {
        toast.error("Failed to save listing");
      }
    });
  };
}
