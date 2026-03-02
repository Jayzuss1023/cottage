"use client";

import {
  ArrowLeft,
  CreditCard,
  Home,
  LayoutDashboard,
  ListPlus,
  MessageSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Dashboard summary",
  },
  {
    href: "/dashboard/listings",
    label: "My Listings",
    icon: Home,
    description: "Manage your properties",
  },
  {
    href: "dashboard/listings/new",
    label: "Add Listing",
    icon: "ListPlus",
    description: "Create new listing",
  },
  {
    href: "dashboard/leads",
    label: "Lead Inbox",
    icon: MessageSquare,
    description: "Buyer inquiries",
  },
  {
    href: "/dashboard/profile",
    label: "Agent Profile",
    icon: User,
    description: "Your public profile",
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
    description: "Manage subscription",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside>
      <div>
        <Link href="/">
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span>Back to Cottage</span>
        </Link>

        {/* Dashboard Header */}
        <div>
          <h2>Agent Dashboard</h2>
          <p>Mnage your listings and leads</p>
        </div>

        {/* Navigation */}
      </div>
    </aside>
  );
}
