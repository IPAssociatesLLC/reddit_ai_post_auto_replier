export const mockAgentConfig = {
    target_url: "https://skool.com/your-group",
    keywords: ["fitness coaching", "online community", "Skool group", "how to grow a membership"],
    subreddits: ["entrepreneur", "fitness", "onlinebusiness", "coaching"],
    quora_topics: ["Online Business", "Fitness", "Coaching", "Community Building"],
    reply_tone: "Helpful & Informative",
    auto_post: false,
    max_daily_replies: 10,
    niche: "Fitness Coaching",
    business_description: "I help fitness coaches build online communities and get more paying clients through Skool groups.",
};
export const mockConnectionStatus = {
    clicksendai_connected: true,
    reddit_connected: true,
    quora_connected: false,
    agent_active: true,
    plan: "Growth",
    plan_active: true,
};
export const mockRecentPosts = [
    {
        id: "1",
        platform: "reddit",
        subreddit: "r/entrepreneur",
        title: "How do I get more paying clients for my online fitness coaching?",
        url: "https://reddit.com/r/entrepreneur/comments/abc123",
        generated_reply: "Honestly the biggest shift for me was getting serious about showing up where my clients already hang out online...",
        status: "posted",
        posted_at: "2026-06-02T14:30:00Z",
        clicks: 12,
    },
    // ... more posts
];
export const mockStats = {
    posts_found_today: 23,
    replies_posted_today: 4,
    total_replies_posted: 127,
    total_clicks: 843,
    approval_rate: 92,
    avg_reply_length: 145,
};
export const mockScanStatus = {
    reddit: { scanning: true, last_scan: "2026-06-02T15:45:00Z", posts_found: 14 },
    quora: { scanning: true, last_scan: "2026-06-02T15:42:00Z", posts_found: 9 },
    next_scan_in: "2 minutes",
};
