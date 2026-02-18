import {
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutGrid,
  Map as MapIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
// import { DynamicMapView } from "@/components/map/DynamicMapView";
import { FilterSidebar } from "@/components/property/FilterSidebar";
import * as PropertyGrid from "@/components/property/PropertyGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sanityFetch } from "@/sanity/lib/live";
import {
  AMENITIES_QUERY,
  PROPERTIES_COUNT_QUERY,
  PROPERTIES_SEARCH_QUERY,
} from "@/sanity/lib/queries/queries";

export const metadata: Metadata = {
  title: "Browse Properties",
  description:
    "Find your perfect home from our curated selection of properties. Filter by price, bedrooms, location, and more.",
};

const ITEMS_PER_PAGE = 12;

interface SearchParams {
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  baths?: string;
  type?: string;
  city?: string;
  page?: string;
  // Advanced filters
  minSqft?: string;
  maxSqft?: string;
  minYear?: string;
  maxYear?: string;
  minLotSize?: string;
  maxLotSize?: string;
  daysOnMarket?: string;
  openHouse?: string;
  priceReduced?: string;
  amenities?: string;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || "1", 10);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  // Parse amenities from comma-separated string
  const amenitiesList = params.amenities?.split(",").filter(Boolean) || [];

  // Handle "5+" values for beds/baths = extract number and track if it's a "plus" value
  const bedsValue = params.beds || "0";
  const bathsValue = params.baths || "0";
  const bedsIsPlus = bedsValue.includes("+");
  const bathsIsPlus = bathsValue.includes("+");
  const bedsNum = Number.parseInt(bedsValue.replace("+", ""), 10) || 0;
  const bathsNum = Number.parseInt(bathsValue.replace("+", ""), 10) || 0;

  const queryParams = {
    minPrice: Number(params.minPrice) || 0,
    maxPrice: Number(params.minPrice) || 0,
    beds: bedsNum,
    bedsIsPlus,
    baths: bathsNum,
    bathsIsPlus,
    type: params.type === "all" ? "" : params.type || 0,
    city: params.city?.toLowerCase() || "",
    // Advanced filters
    minSqft: Number(params.minSqft) || 0,
    maxSqft: Number(params.maxSqft) || 0,
    minYear: Number(params.minYear) || 0,
    maxYear: Number(params.maxYear) || 0,
    minLotSize: Number(params.minLotSize) || 0,
    maxLotSize: Number(params.maxLotSize) || 0,
    daysOnMarket: Number(params.daysOnMarket) || 0,
    openHouse: params.priceReduced === "true",
    priceReduced: params.priceReduced === "true",
    amenities: amenitiesList,
    amenitiesCount: amenitiesList.length,
    start,
    end,
  };

  const [{ data: properties }, { data: totalCount }, { data: amenities }] =
    await Promise.all([
      sanityFetch({
        query: PROPERTIES_SEARCH_QUERY,
        params: queryParams,
      }),
      sanityFetch({
        query: PROPERTIES_COUNT_QUERY,
        params: queryParams,
      }),
      sanityFetch({
        query: AMENITIES_QUERY,
      }),
    ]);

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);
  const hasFilters =
    params.minPrice ||
    params.maxPrice ||
    params.beds ||
    params.baths ||
    (params.type && params.type !== "all") ||
    params.city ||
    params.minSqft ||
    params.maxSqft ||
    params.minYear ||
    params.maxYear ||
    params.minLotSize ||
    params.maxLotSize ||
    params.daysOnMarket ||
    params.openHouse === "true" ||
    params.priceReduced === "true" ||
    params.amenities;

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <nav>
            <Link href="/">Home</Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span>Properties</span>
          </nav>
          <h1>Browse Properties</h1>
          <p>Find your perfect cottage from our curated selection</p>
        </div>
      </div>

      <div>
        <div>
          {/* Sidebar */}
          <aside>
            <div>
              <Suspense
                fallback={<Skeleton className="h-125 w-full rounded-2xl" />}
              >
                <FilterSidebar amenities={amenities || []} />
              </Suspense>
            </div>
          </aside>

          {/* Main Content */}
          <div>{/* Results Header */}</div>
        </div>
      </div>
    </div>
  );
}
