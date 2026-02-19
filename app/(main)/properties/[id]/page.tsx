import { auth } from "@clerk/nextjs/server";
import {
  Bath,
  Bed,
  Calendar,
  Check,
  ChevronRight,
  MapPin,
  Square,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DynamicMapView } from "@/components/map/DynamicMapView";
// import { AgentCard } from "@/components/property/AgentCard";
// import { ContactAgentButton } from "@/components/property/ContactAgentButton";
// import { ImageGallery } from "@/components/property/ImageGallery";
// import { SavePropertyButton } from "@/components/property/SavePropertyButton";
// import { SharePropertyButton } from "@/components/property/SharePropertyButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { StatBadge } from "@/components/ui/stat-badge";
import { sanityFetch } from "@/sanity/lib/live";
import { PROPERTY_DETAIL_QUERY } from "@/sanity/lib/queries/queries";
import { Property } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: property } = await sanityFetch({
    query: PROPERTY_DETAIL_QUERY,
    params: { id },
  });

  const prop = (property || {}) as Property;

  if (!property) {
    return { title: "Property Not Found" };
  }

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(prop.price);

  return {
    title: `${prop.title} - ${price}`,
    description:
      prop.description?.slice(0, 160) ||
      `Beautiful ${prop.propertyType || "property"} with ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms.`,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: prop } = await sanityFetch({
    query: PROPERTY_DETAIL_QUERY,
    params: { id },
  });

  const property = (prop || {}) as Property;

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number) => {
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(property.price);
  };

  const statusLabel =
    property.status && property.status !== "active"
      ? property.status.charAt(0).toUpperCase() + property.status.slice(1)
      : null;

  return (
    <div>
      {/* Breadcrumb */}
      <div>
        <div>
          <nav>
            <Link href="/">Home</Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <Link href="/properties">Properties</Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </nav>
        </div>
      </div>
    </div>
  );
}
