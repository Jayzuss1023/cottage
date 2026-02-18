"use client";

import type { Property } from "@/types";
import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  onSave?: (propertyId: string) => void;
  saveIds?: string[];
  showRemoveButton?: boolean;
}

export function PropertyGrid({
  properties,
  onSave,
  saveIds = [],
  showRemoveButton,
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div>
        <p>No Properties</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={(property || {}) as Property}
          onSave={onSave}
          isSaved={saveIds?.includes(property._id)}
          showRemoveButton={showRemoveButton}
        />
      ))}
    </div>
  );
}
