-- ClickSendAI Forum Agent - Supabase Database Schema
-- Creates 4 tables: forum_agent_config, forum_activity, forum_reply_stats, forum_scan_queue
-- All tables have RLS policies, indexes, views, triggers, and stored functions.
 
-- 1. forum_agent_config table
CREATE TABLE IF NOT EXISTS forum_agent_config (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_url text NOT NULL DEFAULT '',
    keywords text[] NOT NULL DEFAULT '{}',
    subreddits text[] NOT NULL DEFAULT '{}',
    quora_topics text[] NOT NULL DEFAULT '{}',
    reply_tone text NOT NULL DEFAULT 'Helpful & Informative',
    auto_post boolean NOT NULL DEFAULT false,
    max_daily_replies integer NOT NULL DEFAULT 10,
    niche text NOT NULL DEFAULT '',
    business_description text NOT NULL DEFAULT '',
    scan_frequency_minutes integer NOT NULL DEFAULT 5,
    reply_delay_minutes integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
 
CREATE INDEX IF NOT EXISTS idx_forum_agent_config_user_id ON forum_agent_config(user_id);
ALTER TABLE forum_agent_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own agent config" ON forum_agent_config FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own agent config" ON forum_agent_config FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own agent config" ON forum_agent_config FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own agent config" ON forum_agent_config FOR DELETE USING (auth.uid() = user_id);
 
-- 2. forum_activity table
CREATE TABLE IF NOT EXISTS forum_activity (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform text NOT NULL CHECK (platform IN ('reddit', 'quora')),
    post_id text NOT NULL,
    post_title text NOT NULL,
    post_url text NOT NULL,
    subreddit text,
    topic text,
    body_text text,
    matched_keywords text[] NOT NULL DEFAULT '{}',
    relevance_score numeric(3,2) DEFAULT 0.0,
    generated_reply text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'posted', 'rejected')),
    posted_at timestamp with time zone,
    clicks integer NOT NULL DEFAULT 0,
    upvotes integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
 
CREATE INDEX IF NOT EXISTS idx_forum_activity_user_id ON forum_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_activity_user_status ON forum_activity(user_id, status);
CREATE INDEX IF NOT EXISTS idx_forum_activity_platform ON forum_activity(platform);
CREATE INDEX IF NOT EXISTS idx_forum_activity_created_at ON forum_activity(created_at DESC);
ALTER TABLE forum_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own activity" ON forum_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activity" ON forum_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own activity" ON forum_activity FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own activity" ON forum_activity FOR DELETE USING (auth.uid() = user_id);
 
-- 3. forum_reply_stats table
CREATE TABLE IF NOT EXISTS forum_reply_stats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date date NOT NULL DEFAULT CURRENT_DATE,
    platform text NOT NULL CHECK (platform IN ('reddit', 'quora')),
    posts_found integer NOT NULL DEFAULT 0,
    replies_posted integer NOT NULL DEFAULT 0,
    total_clicks integer NOT NULL DEFAULT 0,
    total_upvotes integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date, platform)
);
CREATE INDEX IF NOT EXISTS idx_forum_reply_stats_user_date ON forum_reply_stats(user_id, date DESC);
ALTER TABLE forum_reply_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own stats" ON forum_reply_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert stats" ON forum_reply_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update stats" ON forum_reply_stats FOR UPDATE USING (true);
 
-- 4. forum_scan_queue table
CREATE TABLE IF NOT EXISTS forum_scan_queue (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform text NOT NULL CHECK (platform IN ('reddit', 'quora')),
    target_url text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scanning', 'completed', 'failed')),
    result jsonb,
    error_message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    scanned_at timestamp with time zone,
    completed_at timestamp with time zone
);
CREATE INDEX IF NOT EXISTS idx_forum_scan_queue_user_status ON forum_scan_queue(user_id, status);
ALTER TABLE forum_scan_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own scan queue" ON forum_scan_queue FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage scan queue" ON forum_scan_queue FOR ALL USING (true);
 
-- 5. Trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$BEGIN NEW.updated_at = timezone('utc'::text, now()); RETURN NEW; END;$$ language 'plpgsql';
 
CREATE TRIGGER update_forum_agent_config_updated_at BEFORE UPDATE ON forum_agent_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_activity_updated_at BEFORE UPDATE ON forum_activity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_reply_stats_updated_at BEFORE UPDATE ON forum_reply_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_scan_queue_updated_at BEFORE UPDATE ON forum_scan_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 
-- 6. Views
CREATE OR REPLACE VIEW forum_activity_summary AS
SELECT user_id, platform,
    COUNT(*) FILTER (WHERE status = 'posted') as posted_count,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
    SUM(clicks) as total_clicks,
    SUM(upvotes) as total_upvotes,
    MAX(created_at) as last_activity_at
FROM forum_activity GROUP BY user_id, platform;
 
CREATE OR REPLACE VIEW forum_daily_stats AS
SELECT user_id, date,
    SUM(posts_found) as total_posts_found,
    SUM(replies_posted) as total_replies_posted,
    SUM(total_clicks) as total_clicks,
    SUM(total_upvotes) as total_upvotes
FROM forum_reply_stats WHERE date >= CURRENT_DATE - INTERVAL '30 days' GROUP BY user_id, date ORDER BY date DESC;
 
-- 7. Stored function: get user activity with pagination
CREATE OR REPLACE FUNCTION get_user_forum_activity(
    p_user_id uuid,
    p_platform text DEFAULT NULL,
    p_status text DEFAULT NULL,
    p_limit integer DEFAULT 50,
    p_offset integer DEFAULT 0
)
RETURNS TABLE (
    id uuid, platform text, post_id text, post_title text, post_url text,
    subreddit text, topic text, generated_reply text, status text,
    posted_at timestamp with time zone, clicks integer, created_at timestamp with time zone
) AS $$BEGIN
    RETURN QUERY
    SELECT fa.id, fa.platform, fa.post_id, fa.post_title, fa.post_url, fa.subreddit,
           fa.topic, fa.generated_reply, fa.status, fa.posted_at, fa.clicks, fa.created_at
    FROM forum_activity fa
    WHERE fa.user_id = p_user_id AND (p_platform IS NULL OR fa.platform = p_platform)
        AND (p_status IS NULL OR fa.status = p_status)
    ORDER BY fa.created_at DESC LIMIT p_limit OFFSET p_offset;
END;$$ LANGUAGE plpgsql SECURITY DEFINER;
 
-- 8. Stored function: update reply status
CREATE OR REPLACE FUNCTION update_reply_status(
    p_activity_id uuid,
    p_user_id uuid,
    p_new_status text,
    p_posted_at timestamp with time zone DEFAULT NULL
)
RETURNS boolean AS $$BEGIN
    IF NOT EXISTS (SELECT 1 FROM forum_activity WHERE id = p_activity_id AND user_id = p_user_id) THEN
        RETURN false;
    END IF;
    UPDATE forum_activity SET status = p_new_status, posted_at = COALESCE(p_posted_at, posted_at),
        updated_at = timezone('utc'::text, now()) WHERE id = p_activity_id;
    RETURN true;
END;$$ LANGUAGE plpgsql SECURITY DEFINER;
