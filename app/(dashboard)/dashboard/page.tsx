import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  Home,
  MessageSquare,
  Plus,
  TrendingUp,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sanityFetch } from "@/sanity/lib/live";
import {
  AGENT_DASHBOARD_QUERY,
  DASHBOARD_LEADS_COUNT_QUERY,
  DASHBOARD_LISTINGS_COUNT_QUERY,
  DASHBOARD_NEW_LEADS_COUNT_QUERY,
} from "@/sanity/lib/queries/queries";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your listings and leads from your agent dashboard.",
};

export default async function DashboardPage() {
  // Middleware: Authentication + Has Plan(agent) + Completed Onboarding: True
  const { userId } = await auth();
}
