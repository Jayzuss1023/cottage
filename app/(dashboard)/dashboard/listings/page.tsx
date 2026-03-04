import { auth } from "@clerk/nextjs/server";
import { MoreHorizontal, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { DeleteListingButton } from "@/components/dashboard/DeleteListingButton";
// import { ListingStatusSelect } from "@/components/dashboard/ListingStatusSelect";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  AGENT_BY_USER_ID_QUERY,
  AGENT_ID_BY_USER_QUERY,
  AGENT_LISTINGS_QUERY,
} from "@/sanity/lib/queries/queries";
import type { Property } from "@/types";

export default async function ListingsPage() {
  const { userId } = await auth();

  const { data: agent } = await sanityFetch({
    query: AGENT_BY_USER_ID_QUERY,
    params: { userId },
  });

  if (!agent) return;

  const { data: listings } = await sanityFetch({
    query: AGENT_LISTINGS_QUERY,
    params: { agentId: agent._id },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <SectionHeader
        title="My Listings"
        subtitle="Manage your property"
        action={
          <Button asChild>
            <Link href="/dashboard/listings/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Listing
            </Link>
          </Button>
        }
      />

      {listings && listings.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-17.5" />
              </TableRow>
            </TableHeader>
          </Table>
        </div>
      ) : (
        <EmptyState
          title="No listings yet"
          description="Create your first property listing to get started."
          action={
            <Button asChild>
              <Link href="/dashboard/listings/new">
                <Plus className="h-4 w-4" />
                Create Listing
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
