import { useState } from "react";
import { mockAgentConfig, mockConnectionStatus, mockRecentPosts, mockStats } from "@/mocks/extension";
 
export default function Popup() {
  const [activeTab, setActiveTab] = useState("config");
  const [agentPaused, setAgentPaused] = useState(!mockConnectionStatus.agent_active);
  const [saved, setSaved] = useState(false);
  const [platform, setPlatform] = useState("reddit");
  const [draftReply, setDraftReply] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);
 
  const [config, setConfig] = useState(mockAgentConfig);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [subredditsInput, setSubredditsInput] = useState("");
 
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
 
  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedReply(
        "The biggest shift for me was getting serious about showing up where my clients already hang out online. " +
        "I combined consistent content with a landing page that captures emails, then drove traffic straight to my coaching program. " +
        "If you're in fitness coaching specifically, this community has been a huge resource for referrals and networking — " +
        "definitely worth checking out: " + config.target_url
      );
      setGenerating(false);
    }, 2000);
  };
 
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
  };
 
  const handleKeywordAdd = () => {
    if (keywordsInput.trim()) {
      const newKeywords = keywordsInput.split(",").map((k) => k.trim()).filter((k) => k && !config.keywords.includes(k));
      setConfig({ ...config, keywords: [...config.keywords, ...newKeywords] });
      setKeywordsInput("");
    }
  };
 
  const handleSubredditAdd = () => {
    if (subredditsInput.trim()) {
      const newSubs = subredditsInput.split(",").map((s) => s.trim()).filter((s) => s && !config.subreddits.includes(s));
      setConfig({ ...config, subreddits: [...config.subreddits, ...newSubs] });
      setSubredditsInput("");
    }
  };
 
  const handleKeywordRemove = (keyword) => {
    setConfig({ ...config, keywords: config.keywords.filter((k) => k !== keyword) });
  };
 
  const handleSubredditRemove = (sub) => {
    setConfig({ ...config, subreddits: config.subreddits.filter((s) => s !== sub) });
  };
 
  const getStatusBadge = (status) => {
    switch (status) {
      case "posted": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "approved": return "bg-amber-50 text-amber-700 border-amber-200";
      case "pending": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };
 
  const displayedPosts = showAllActivity ? mockRecentPosts : mockRecentPosts.slice(0, 4);
 
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="w-full max-w-[680px] bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header, Stats, Tabs, Config, Draft, Activity, Performance, Footer */}
      </div>
    </div>
  );
}// Main extension popup UI
// 4 tabs: Configuration, Draft Reply, Activity Log, Performance
// State: agentPaused, activeTab, config, draftReply, generatedReply
// Key features: keyword tags, subreddit tags, platform toggle, AI generate, activity log
