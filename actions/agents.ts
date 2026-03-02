"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/lib/live";
import {
  AGENT_BY_USER_ID_QUERY,
  AGENT_ID_BY_USER_QUERY,
} from "@/sanity/lib/queries/queries";
import type { AgentOnboardingData, AgentProfileData } from "@/types";

/**
 * Creates agent doc for a user subscribed to agent plan
 * Called lazily when user first visits the page after subscribing
 */

export async function createAgentDocument() {
  const { userId, has } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Verify user has agent plan
  const hasAgentPlan = has({ plan: "agent" });
  if (!hasAgentPlan) {
    throw new Error("User does not have agent plan");
  }

  // Check if agent exists
  const { data: existingAgent } = await sanityFetch({
    query: AGENT_ID_BY_USER_QUERY,
    params: { userId },
  });

  if (existingAgent) {
    return {
      existingAgent,
    };
  }

  // Get user details from Clerk
  const user = await currentUser();
  if (!user) {
    throw new Error("Could not get user details");
  }

  // Create agent document
  const agent = await client.create({
    _type: "agent",
    userId,
    name: `${user.firstName} || "" ${user.lastName} || ""`.trim() || "Agent",
    email: user.emailAddresses[0]?.emailAddress || "",
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
  });

  return agent;
}

export async function completeAgentOnboarding(data: AgentOnboardingData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { data: agent } = await sanityFetch({
    query: AGENT_BY_USER_ID_QUERY,
    params: { userId },
  });

  if (!agent) {
    throw new Error("Agent not found");
  }

  // Update agent in Sanity
  await client
    .patch(agent._id)
    .set({
      bio: data.bio,
      phone: data.phone,
      licenseNumber: data.licenseNumber,
      agency: data.agency || "",
      onboardingComplete: true,
    })
    .commit();

  // Set Clerk metadata
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...clerkUser.publicMetadata,
      onboardingComplete: true,
      agentOnboardingComplete: true,
    },
  });

  redirect("/dashboard");
}

export async function updateAgentProfile(data: AgentProfileData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { data: agent } = await sanityFetch({
    query: AGENT_BY_USER_ID_QUERY,
    params: { userId },
  });

  if (!agent) {
    throw new Error("Agent not found");
  }

  await client
    .patch(agent._id)
    .set({
      bio: data.bio,
      phone: data.phone,
      licenseNumber: data.licenseNumber,
      agency: data.agency,
    })
    .commit();
}

export async function getAgentByUserId(userId: string) {
  const { data: agent } = await sanityFetch({
    query: AGENT_BY_USER_ID_QUERY,
    params: { userId },
  });

  return agent;
}
