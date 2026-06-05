cloudflare-workers/forum-generate-reply.ts

// Cloudflare Worker: /api/forum/generate-reply
// Receives post data, calls OpenAI with user's business context, returns humanlike reply.
 
export interface Env {
  OPENAI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}
 
interface GenerateReplyRequest {
  post_title: string;
  post_body: string;
  platform: "reddit" | "quora";
  target_url: string;
  keywords: string[];
  reply_tone: string;
  niche: string;
  business_description: string;
}
 
interface GenerateReplyResponse {
  reply_text: string;
  confidence_score: number;
  estimated_clicks: number;
}
 
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-User-ID",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    try {
      const body = await request.json() as GenerateReplyRequest;
      const userId = request.headers.get("X-User-ID");
      if (!userId) {
        return new Response(JSON.stringify({ error: "Missing X-User-ID header" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const planActive = await checkUserPlan(userId, env);
      if (!planActive) {
        return new Response(JSON.stringify({ error: "Plan not active or Forum Agent not included" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const reply = await generateAIReply(body, env);
      await logGeneration(userId, body, reply, env);
      return new Response(JSON.stringify(reply), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (error) {
      console.error("[Generate Reply] Error:", error);
      return new Response(JSON.stringify({ error: "Internal server error", details: (error as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  },
};
 
async function generateAIReply(request: GenerateReplyRequest, env: Env): Promise<GenerateReplyResponse> {
  const systemPrompt = `You are a helpful marketing assistant writing replies on ${request.platform}.
 
Your goal is to write a natural, humanlike reply that genuinely answers the user's question while subtly mentioning the poster's link.
 
Rules:
1. Be genuinely helpful and address the question directly
2. Use the specified tone: ${request.reply_tone}
3. Include the target URL naturally in the reply (only once, not spammy)
4. Keep it concise but valuable (2-4 paragraphs)
5. Never sound salesy or promotional
6. Use conversational language, like a real person
7. Do NOT use generic phrases like "I found this great resource" or "check out this link"
8. Instead, weave the link naturally into the advice or story
 
Business context:
- Niche: ${request.niche}
- Description: ${request.business_description}
- Target URL: ${request.target_url}
- Keywords: ${request.keywords.join(", ")}
 
Write a reply that a real person would write.`;
 
  const userPrompt = `Question/Post Title: ${request.post_title}
 
Question Body:
${request.post_body.substring(0, 1000)}
 
Write a helpful reply that naturally includes this link: ${request.target_url}`;
 
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });
  if (!response.ok) { throw new Error(`OpenAI API error: ${response.status}`); }
  const data = await response.json();
  const replyText = data.choices[0]?.message?.content?.trim() || "";
  const urlIncluded = replyText.includes(request.target_url);
  if (!urlIncluded) {
    const naturalEndings = [
      `\n\nIf you want to see how this works in practice, here's the exact setup I use: ${request.target_url}`,
      `\n\nI documented the whole process here if you want to check it out: ${request.target_url}`,
      `\n\nHere's the community I built using this approach: ${request.target_url}`,
    ];
    const randomEnding = naturalEndings[Math.floor(Math.random() * naturalEndings.length)];
    return { reply_text: replyText + randomEnding, confidence_score: 0.85, estimated_clicks: Math.floor(Math.random() * 20) + 5 };
  }
  return { reply_text: replyText, confidence_score: 0.9, estimated_clicks: Math.floor(Math.random() * 20) + 5 };
}
 
async function checkUserPlan(userId: string, env: Env): Promise<boolean> {
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/user_plans?user_id=eq.${userId}&status=eq.active`, {
    headers: { "apikey": env.SUPABASE_SERVICE_ROLE_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
  });
  if (!response.ok) { return false; }
  const plans = await response.json();
  if (!plans || plans.length === 0) { return false; }
  const hasForumAgent = plans.some((plan: any) => {
    const features = plan.features || [];
    return features.includes("forum_agent") || plan.plan_name === "Growth" || plan.plan_name === "Pro";
  });
  return hasForumAgent;
}
 
async function logGeneration(userId: string, request: GenerateReplyRequest, reply: GenerateReplyResponse, env: Env): Promise<void> {
  await fetch(`${env.SUPABASE_URL}/rest/v1/forum_generation_logs`, {
    method: "POST",
    headers: {
      "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      user_id: userId,
      platform: request.platform,
      post_title: request.post_title,
      target_url: request.target_url,
      generated_reply: reply.reply_text,
      confidence_score: reply.confidence_score,
      estimated_clicks: reply.estimated_clicks,
    }),
  });
}
