// Cloudflare Worker: /api/user/plan-status
// Checks if user's plan is active and includes Forum Agent add-on.
 
export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}
 
interface PlanStatusResponse {
  user_id: string;
  plan_active: boolean;
  plan_name: string;
  features: string[];
  forum_agent_enabled: boolean;
  daily_replies_used: number;
  daily_replies_limit: number;
  reset_date: string;
}
 
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("user_id");
      if (!userId) {
        return new Response(JSON.stringify({ error: "Missing user_id parameter" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const status = await getUserPlanStatus(userId, env);
      return new Response(JSON.stringify(status), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (error) {
      console.error("[Plan Status] Error:", error);
      return new Response(JSON.stringify({ error: "Internal server error", details: (error as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  },
};
 
async function getUserPlanStatus(userId: string, env: Env): Promise<PlanStatusResponse> {
  const planResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/user_plans?user_id=eq.${userId}&status=eq.active&order=created_at.desc&limit=1`,
    { headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
  );
  let planActive = false;
  let planName = "Free";
  let features: string[] = [];
  let dailyLimit = 0;
  if (planResponse.ok) {
    const plans = await planResponse.json();
    if (plans && plans.length > 0) {
      const plan = plans[0];
      planActive = true;
      planName = plan.plan_name || "Unknown";
      features = plan.features || [];
      dailyLimit = plan.daily_replies_limit || 0;
    }
  }
  const forumAgentEnabled = features.includes("forum_agent") || planName === "Growth" || planName === "Pro";
  const today = new Date().toISOString().split("T")[0];
  const usageResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/forum_reply_stats?user_id=eq.${userId}&date=eq.${today}`,
    { headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
  );
  let dailyUsed = 0;
  if (usageResponse.ok) {
    const usage = await usageResponse.json();
    if (usage && usage.length > 0) {
      dailyUsed = usage.reduce((sum: number, u: any) => sum + (u.replies_posted || 0), 0);
    }
  }
  return {
    user_id: userId,
    plan_active: planActive,
    plan_name: planName,
    features,
    forum_agent_enabled: forumAgentEnabled,
    daily_replies_used: dailyUsed,
    daily_replies_limit: dailyLimit,
    reset_date: today,
  };
}
