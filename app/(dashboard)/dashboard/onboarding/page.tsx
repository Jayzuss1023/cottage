import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AGENT_ONBOARDING_CHECK_QUERY } from "@//sanity/lib/queries/queries";
import { createAgentDocument } from "@/actions/agents";
import { AgentOnboardingForm } from "@/components/forms/AgentOnboardingForm";
import { sanityFetch } from "@/sanity/lib/live";

export default async function AgentOnboardingPage() {
  // Middleware guarantees: User is authenticated + has agent plan
  const { userId } = await auth();

  //Fetch agaent (may not exist yet for new subscribers)
  const { data: agent } = await sanityFetch({
    query: AGENT_ONBOARDING_CHECK_QUERY,
    params: { userId },
  });

  // lazy creation: Create one if no agent
  if (!agent) {
    await createAgentDocument();
    // Refresh the page to load the newly created agent
    redirect("/dashboard/onboarding");
  }

  // Redirect to dashboard if onboarded
  if (agent.onboardingComplete) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Agent Profile</h1>
        <p>Set up your professional profile to start listing properties.</p>
      </div>

      <AgentOnboardingForm />
    </div>
  );
}
