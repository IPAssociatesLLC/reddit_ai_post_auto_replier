# ClickSendAI Forum Agent — Integration Guide for AI Builder
 
> **Target Audience:** The AI model / builder that manages the ClickSendAI platform on Cloudflare.
> **Purpose:** Integrate this browser extension into the existing ClickSendAI dashboard and backend.
> **Constraint:** This is a standalone module. Do NOT modify existing platform tables. Use `CREATE TABLE IF NOT EXISTS` for all new tables. Integrate with existing `reddit_replier` or `forum_agent` tables if they already exist.
 
## 1. Project Overview
 
This module adds a **Chrome Browser Extension** that:
- Scans Reddit and Quora for posts matching user-defined keywords
- Generates humanlike AI replies using the user's ClickSendAI AI agent configuration
- Posts replies automatically (or after manual approval) using the user's existing browser login session
- Returns all activity data back to the user's ClickSendAI dashboard
 
**Auth method:** Uses the user's existing ClickSendAI browser cookies. No API keys exposed to users. The extension automates what a user would do manually.
 
## 2. File Inventory & Where Each File Goes
 
### React UI Pages (Dashboard Reference)
These are the UI pages for the browser extension popup and settings. They are built in React + Tailwind. Use them as reference for the UI/UX patterns in your existing dashboard.
 
| File | Purpose | Integration Action |
|------|---------|-------------------|
| `src/pages/popup/page.tsx` | Extension popup UI (Configuration, Draft Reply, Activity Log, Performance tabs) | Merge UI patterns into your existing Dashboard's Reddit Replier tab |
| `src/pages/options/page.tsx` | Extension settings (Agent Config, Accounts, Advanced) | Merge settings UI into your existing dashboard settings |
| `src/pages/onboarding/page.tsx` | First-time setup flow (4 steps) | Use as reference for onboarding new users to the Forum Agent add-on |
| `src/pages/login/page.tsx` | Sign-in page | Not needed — your existing auth handles this |
| `src/pages/register/page.tsx` | Sign-up page | Not needed — your existing auth handles this |
| `src/pages/home/page.tsx` | Landing page | Reference only |
| `src/pages/architecture/page.tsx` | Architecture docs | Reference only |
| `src/mocks/extension.ts` | Mock data for all UI states | Replace with real data from your backend |
 
### Chrome Extension (Actual Extension Code)
These files become the actual Chrome extension. Package them into a `.zip` and upload to Chrome Web Store.
 
| File | Purpose | Integration Action |
|------|---------|-------------------|
| `chrome-extension/manifest.json` | Extension manifest (V3) | Replace placeholder URLs with your actual Cloudflare + Supabase URLs |
| `chrome-extension/src/background.ts` | Service worker (scan engine, AI calls, data storage) | Replace `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `CLOUDFLARE_BACKEND` constants |
| `chrome-extension/src/reddit-content.ts` | Reddit DOM scanner & reply poster | No changes needed unless Reddit DOM changes |
| `chrome-extension/src/quora-content.ts` | Quora DOM scanner & reply poster | No changes needed unless Quora DOM changes |
 
### Cloudflare Workers (Deploy to Your Cloudflare Account)
These are Worker templates that need to be deployed as part of your existing Cloudflare backend.
 
| File | Purpose | Endpoint |
|------|---------|----------|
| `cloudflare-workers/forum-generate-reply.ts` | AI reply generation | `POST /api/forum/generate-reply` |
| `cloudflare-workers/forum-plan-status.ts` | User plan validation | `GET /api/user/plan-status?user_id={id}` |
 
### Database Schema (Run in Your Existing Supabase)
This SQL creates new tables. It is **safe to run** because it uses `CREATE TABLE IF NOT EXISTS`.
 
| File | Purpose |
|------|---------|
| `supabase/schema/forum_agent.sql` | Creates 4 tables: `forum_agent_config`, `forum_activity`, `forum_reply_stats`, `forum_scan_queue` |
 
## 3. Step-by-Step Integration Instructions
 
### Step 1: Database Schema (Safe — No Existing Tables Modified)
 
Run the SQL in `supabase/schema/forum_agent.sql` in your Supabase SQL Editor.
 
**Safety measures in the SQL:**
- All tables use `CREATE TABLE IF NOT EXISTS` — will not overwrite existing tables
- All tables use `IF NOT EXISTS` for indexes, triggers, views, and functions
- RLS policies are scoped per-user
- No `ALTER` or `DROP` statements on existing tables
 
**If you already have `reddit_replier` tables:**
- The SQL will skip creation of `forum_agent_config` if it exists
- You should manually review the columns and adapt the extension background worker to use your existing column names
- The extension `background.ts` uses `forum_activity` as the main activity table. If you have an existing `reddit_replier_activity` table, update the background worker to write to that table instead
 
**Tables created:**
 
| Table | What it stores | Key columns |
|-------|---------------|-------------|
| `forum_agent_config` | User's agent settings | `user_id`, `target_url`, `keywords`, `subreddits`, `quora_topics`, `reply_tone`, `auto_post`, `max_daily_replies` |
| `forum_activity` | Every found post + generated reply | `user_id`, `platform`, `post_title`, `post_url`, `generated_reply`, `status`, `clicks`, `posted_at` |
| `forum_reply_stats` | Daily aggregated stats | `user_id`, `date`, `platform`, `posts_found`, `replies_posted`, `total_clicks` |
| `forum_scan_queue` | Background scan queue | `user_id`, `platform`, `status`, `result`, `error_message` |



