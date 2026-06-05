// ClickSendAI Forum Agent - Background Service Worker
// Handles: periodic scans, Cloudflare backend calls, Supabase storage, content script coordination
// --- Constants ---
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
const CLOUDFLARE_BACKEND = "https://your-worker.your-subdomain.workers.dev";
// --- State ---
let agentConfig = null;
let isScanning = false;
let dailyReplyCount = 0;
// --- Message Handlers ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        try {
            switch (message.type) {
                case "GET_CONFIG":
                    const config = await loadAgentConfig();
                    sendResponse({ success: true, config });
                    break;
                case "SAVE_CONFIG":
                    await saveAgentConfig(message.config);
                    sendResponse({ success: true });
                    break;
                case "START_AGENT":
                    await startAgent(message.config);
                    sendResponse({ success: true, message: "Agent started" });
                    break;
                case "STOP_AGENT":
                    await stopAgent();
                    sendResponse({ success: true, message: "Agent stopped" });
                    break;
                case "MANUAL_SCAN":
                    const results = await runManualScan();
                    sendResponse({ success: true, posts: results });
                    break;
                case "GENERATE_REPLY":
                    const reply = await generateReply(message.post, message.config);
                    sendResponse({ success: true, reply });
                    break;
                case "POST_REPLY":
                    const posted = await postReply(message.post_id, message.reply_text, message.platform);
                    sendResponse({ success: posted });
                    break;
                case "GET_ACTIVITY_LOG":
                    const logs = await getActivityLog(message.user_id);
                    sendResponse({ success: true, logs });
                    break;
                case "APPROVE_REPLY":
                    await approveReply(message.post_id);
                    sendResponse({ success: true });
                    break;
                case "REJECT_REPLY":
                    await rejectReply(message.post_id);
                    sendResponse({ success: true });
                    break;
                case "GET_USER_STATUS":
                    const status = await getUserStatus();
                    sendResponse({ success: true, status });
                    break;
                case "FOUND_POSTS":
                    await handleFoundPosts(message.posts);
                    sendResponse({ success: true });
                    break;
                case "REPLY_POSTED":
                    await handleReplyPosted(message.post_id, message.post_url, message.clicks || 0);
                    sendResponse({ success: true });
                    break;
                default:
                    sendResponse({ success: false, error: "Unknown message type" });
            }
        }
        catch (error) {
            console.error("[Background] Error:", error);
            sendResponse({ success: false, error: error.message });
        }
    })();
    return true;
});
// --- Alarm Handler ---
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "forum_scan") {
        console.log("[Background] Alarm triggered: forum_scan");
        await checkDailyReset();
        if (agentConfig && !isScanning) {
            await runBackgroundScan();
        }
    }
});
// --- Agent Control ---
async function startAgent(config) {
    agentConfig = config;
    await chrome.storage.local.set({ agent_active: true, agent_config: config });
    const intervalMinutes = config.scan_frequency_minutes || 5;
    await chrome.alarms.create("forum_scan", { periodInMinutes: intervalMinutes });
    console.log(`[Background] Agent started. Scanning every ${intervalMinutes} minutes.`);
    await runBackgroundScan();
}
async function stopAgent() {
    agentConfig = null;
    await chrome.storage.local.set({ agent_active: false });
    await chrome.alarms.clear("forum_scan");
    console.log("[Background] Agent stopped");
}
// --- Config Management ---
async function loadAgentConfig() {
    const result = await chrome.storage.local.get("agent_config");
    if (result.agent_config) {
        agentConfig = result.agent_config;
    }
    return agentConfig;
}
async function saveAgentConfig(config) {
    await chrome.storage.local.set({ agent_config: config });
    agentConfig = config;
}
// --- Daily Limit Reset ---
async function checkDailyReset() {
    const result = await chrome.storage.local.get(["last_reset_date", "daily_reply_count"]);
    const today = new Date().toISOString().split("T")[0];
    if (result.last_reset_date !== today) {
        await chrome.storage.local.set({ daily_reply_count: 0, last_reset_date: today });
        dailyReplyCount = 0;
        console.log("[Background] Daily reply count reset");
    }
    else {
        dailyReplyCount = result.daily_reply_count || 0;
    }
}
// --- Scan Engine ---
async function runBackgroundScan() {
    if (isScanning)
        return;
    isScanning = true;
    try {
        const config = await loadAgentConfig();
        if (!config || !config.user_id) {
            isScanning = false;
            return;
        }
        await checkDailyReset();
        if (dailyReplyCount >= config.max_daily_replies) {
            console.log("[Background] Daily reply limit reached.");
            isScanning = false;
            return;
        }
        const planStatus = await checkPlanStatus(config.user_id);
        if (!planStatus.active) {
            console.log("[Background] User plan not active.");
            isScanning = false;
            return;
        }
        if (config.subreddits && config.subreddits.length > 0) {
            await scanPlatform("reddit", config);
        }
        if (config.quora_topics && config.quora_topics.length > 0) {
            await scanPlatform("quora", config);
        }
    }
    catch (error) {
        console.error("[Background] Scan error:", error);
    }
    finally {
        isScanning = false;
    }
}
async function runManualScan() {
    const config = await loadAgentConfig();
    if (!config)
        return [];
    const allPosts = [];
    if (config.subreddits && config.subreddits.length > 0) {
        const redditPosts = await scanPlatform("reddit", config);
        allPosts.push(...redditPosts);
    }
    if (config.quora_topics && config.quora_topics.length > 0) {
        const quoraPosts = await scanPlatform("quora", config);
        allPosts.push(...quoraPosts);
    }
    return allPosts;
}
async function scanPlatform(platform, config) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve([]), 30000);
        const targetUrls = platform === "reddit"
            ? config.subreddits.map((s) => `https://www.reddit.com/r/${s}/new/`)
            : config.quora_topics.map((t) => `https://www.quora.com/topic/${encodeURIComponent(t)}`);
        const foundPosts = [];
        let tabsProcessed = 0;
        targetUrls.forEach((url) => {
            chrome.tabs.create({ url, active: false }, (tab) => {
                if (!tab.id) {
                    tabsProcessed++;
                    if (tabsProcessed >= targetUrls.length) {
                        clearTimeout(timeout);
                        resolve(foundPosts);
                    }
                    return;
                }
                setTimeout(async () => {
                    try {
                        await chrome.tabs.sendMessage(tab.id, {
                            type: "SCAN_PAGE",
                            config: { keywords: config.keywords, target_url: config.target_url, platform },
                        });
                        const listener = (msg) => {
                            if (msg.type === "FOUND_POSTS" && msg.platform === platform) {
                                foundPosts.push(...msg.posts);
                                chrome.runtime.onMessage.removeListener(listener);
                                tabsProcessed++;
                                chrome.tabs.remove(tab.id);
                                if (tabsProcessed >= targetUrls.length) {
                                    clearTimeout(timeout);
                                    resolve(foundPosts);
                                }
                            }
                        };
                        chrome.runtime.onMessage.addListener(listener);
                        setTimeout(() => {
                            chrome.runtime.onMessage.removeListener(listener);
                            tabsProcessed++;
                            chrome.tabs.remove(tab.id);
                            if (tabsProcessed >= targetUrls.length) {
                                clearTimeout(timeout);
                                resolve(foundPosts);
                            }
                        }, 15000);
                    }
                    catch (error) {
                        tabsProcessed++;
                        chrome.tabs.remove(tab.id);
                        if (tabsProcessed >= targetUrls.length) {
                            clearTimeout(timeout);
                            resolve(foundPosts);
                        }
                    }
                }, 5000);
            });
        });
    });
}
// --- Handle Found Posts ---
async function handleFoundPosts(posts) {
    const config = await loadAgentConfig();
    if (!config)
        return;
    for (const post of posts) {
        const reply = await generateReply(post, config);
        await storeReplyInSupabase(post, reply);
        if (config.auto_post && dailyReplyCount < config.max_daily_replies) {
            await postReply(post.id, reply.reply_text, post.platform);
        }
    }
}
// --- AI Reply Generation (via Cloudflare backend) ---
async function generateReply(post, config) {
    try {
        const response = await fetch(`${CLOUDFLARE_BACKEND}/api/forum/generate-reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-User-ID": config.user_id },
            body: JSON.stringify({
                post_title: post.title,
                post_body: post.body_text,
                platform: post.platform,
                target_url: config.target_url,
                keywords: config.keywords,
                reply_tone: config.reply_tone,
                niche: config.niche,
                business_description: config.business_description,
            }),
        });
        if (!response.ok) {
            throw new Error(`Generation failed: ${response.status}`);
        }
        const data = await response.json();
        return {
            post_id: post.id,
            reply_text: data.reply_text,
            status: config.auto_post ? "pending" : "pending",
            posted_at: null,
            clicks: 0,
        };
    }
    catch (error) {
        console.error("[Background] Reply generation failed:", error);
        return { post_id: post.id, reply_text: "", status: "pending", posted_at: null, clicks: 0 };
    }
}
// --- Post Reply ---
async function postReply(postId, replyText, platform) {
    try {
        const tabs = await chrome.tabs.query({ url: platform === "reddit" ? "https://*.reddit.com/*" : "https://*.quora.com/*" });
        for (const tab of tabs) {
            if (!tab.id)
                continue;
            try {
                const response = await chrome.tabs.sendMessage(tab.id, {
                    type: "POST_REPLY", post_id: postId, reply_text: replyText, platform,
                });
                if (response && response.success) {
                    dailyReplyCount++;
                    await chrome.storage.local.set({ daily_reply_count: dailyReplyCount });
                    return true;
                }
            }
            catch (error) {
                continue;
            }
        }
        return false;
    }
    catch (error) {
        console.error("[Background] Post reply failed:", error);
        return false;
    }
}
// --- Supabase Integration ---
async function storeReplyInSupabase(post, reply) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/forum_activity`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal",
            },
            body: JSON.stringify({
                user_id: agentConfig?.user_id,
                platform: post.platform,
                post_title: post.title,
                post_url: post.url,
                subreddit: post.subreddit || null,
                topic: post.topic || null,
                generated_reply: reply.reply_text,
                status: reply.status,
                clicks: 0,
                posted_at: null,
            }),
        });
        if (!response.ok) {
            throw new Error(`Supabase insert failed: ${response.status}`);
        }
    }
    catch (error) {
        console.error("[Background] Supabase store failed:", error);
    }
}
async function updateReplyStatus(postId, status, postedAt = null, clicks = 0) {
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/forum_activity?post_id=eq.${postId}`, {
            method: "PATCH",
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal",
            },
            body: JSON.stringify({ status, posted_at: postedAt, clicks }),
        });
    }
    catch (error) {
        console.error("[Background] Status update failed:", error);
    }
}
async function approveReply(postId) {
    await updateReplyStatus(postId, "approved");
}
async function rejectReply(postId) {
    await updateReplyStatus(postId, "rejected");
}
async function handleReplyPosted(postId, postUrl, clicks) {
    await updateReplyStatus(postId, "posted", new Date().toISOString(), clicks);
}
async function getActivityLog(userId) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/forum_activity?user_id=eq.${userId}&order=created_at.desc`, {
            headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
        });
        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error("[Background] Get activity log failed:", error);
        return [];
    }
}
// --- Plan Check ---
async function checkPlanStatus(userId) {
    try {
        const response = await fetch(`${CLOUDFLARE_BACKEND}/api/user/plan-status?user_id=${userId}`, {
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            return { active: false, plan: "" };
        }
        const data = await response.json();
        return { active: data.plan_active, plan: data.plan_name };
    }
    catch (error) {
        console.error("[Background] Plan check failed:", error);
        return { active: false, plan: "" };
    }
}
async function getUserStatus() {
    const result = await chrome.storage.local.get(["agent_active", "daily_reply_count", "last_reset_date"]);
    const config = await loadAgentConfig();
    return {
        agent_active: result.agent_active || false,
        daily_reply_count: result.daily_reply_count || 0,
        max_daily_replies: config?.max_daily_replies || 10,
        config_loaded: !!config,
        user_id: config?.user_id || null,
    };
}
// --- Cookie-based Auth ---
async function getClickSendAIUserId() {
    try {
        const cookies = await chrome.cookies.getAll({ domain: "clicksendai.com" });
        const sessionCookie = cookies.find((c) => c.name === "session" || c.name === "auth_token");
        if (sessionCookie) {
            return sessionCookie.value;
        }
        return null;
    }
    catch (error) {
        console.error("[Background] Auth check failed:", error);
        return null;
    }
}
export {};
