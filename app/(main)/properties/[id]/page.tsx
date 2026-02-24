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
import { ImageGallery } from "@/components/property/ImageGallery";
import { SavePropertyButton } from "@/components/property/SavePropertyButton";
import { SharePropertyButton } from "@/components/property/SharePropertyButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatBadge } from "@/components/ui/stat-badge";
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
  console.log(property);

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const statusLabel =
    property.status && property.status !== "active"
      ? property.status.charAt(0).toUpperCase() + property.status.slice(1)
      : null;

  return (
    <div className="min-h-screen bg-accent/20">
      {/* Breadcrumb */}
      <div className="bg-background border-b border-border/50">
        <div className="container py-4">
          <nav
            className="flex items-center gap-2 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <Link
              href="/properties"
              className="hover:text-foreground transition-colors"
            >
              Properties
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="text-foreground font-medium truncase max-w-50">
              {property.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div>
            {/* Gallery */}
            <ImageGallery
              images={property.images || []}
              title={property.title}
            />

            {/* Prop Header */}
            <div>
              <div>
                <div>
                  <div>
                    <h1>{formatPrice(property.price)}</h1>
                    {statusLabel && (
                      <Badge
                        variant={
                          property.status === "sold" ? "destructive" : "outline"
                        }
                      >
                        {statusLabel}
                      </Badge>
                    )}
                  </div>
                  <h2>{property.title}</h2>
                </div>
                <div>
                  {userId && <SavePropertyButton propertyId={property._id} />}
                  <SharePropertyButton
                    title={property.title}
                    price={formatPrice(property.price)}
                  />
                </div>
              </div>

              {property.address && (
                <div>
                  <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>
                    {property.address.street}, {property.address.city},{" "}
                    {property.address.state}&nbsp;{property.address.zipCode}
                  </span>
                </div>
              )}

              {/* Property Type Badge */}
              {property.propertyType && (
                <div className="mt-4">
                  <Badge variant="secondary" className="capitalize">
                    {property.propertyType}
                  </Badge>
                </div>
              )}
            </div>

            {/* Property Stats */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBadge
                icon={Bed}
                value={property.bedrooms}
                label="Bedrooms"
                color="primary"
              />
              <StatBadge
                icon={Bath}
                value={property.bathrooms}
                label="Bathrooms"
                color="secondary"
              />
              <StatBadge
                icon={Square}
                value={property.squareFeet || 0}
                label="Sq Ft"
                color="primary"
              />
              {property.yearBuilt && (
                <StatBadge
                  icon={Calendar}
                  value={property.yearBuilt}
                  label="Year Built"
                  color="secondary"
                />
              )}
            </div>

            {/* Description */}
            {property.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{property.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    {property.amenities.map((amenity: string) => (
                      <div key={amenity}>
                        <div>
                          <Check
                            className="h-4 w-4 text-succes"
                            aria-hidden="true"
                          />
                          <span>{amenity.replace(/-/g, " ")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {property.location && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-100">
                    <DynamicMapView
                      properties={[
                        {
                          ...property,
                          slug: property.slug || id,
                        },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Agent Card */}
          <div>
            <div>
              {property.agent && (
                <AgentCard agent={property.agent}>
                  <ContactAgentButton
                    propertyId={property._id}
                    agentId={property.agent._id}
                    isAuthenticated={!!userId}
                  />
                </AgentCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
