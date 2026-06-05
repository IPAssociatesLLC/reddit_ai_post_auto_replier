import { useState } from "react";
import { mockAgentConfig, mockConnectionStatus, mockRecentPosts, mockStats } from "@/mocks/extension";

export default function Popup() {
  const [activeTab, setActiveTab] = useState("config");
  const [agentPaused, setAgentPaused] = useState(!mockConnectionStatus.agent_active);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState(mockAgentConfig);
  const [generatedReply, setGeneratedReply] = useState("");
  const [generating, setGenerating] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="w-full max-w-[680px] bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">ClickSendAI Forum Agent</h1>
          <button
            onClick={() => setAgentPaused(!agentPaused)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              agentPaused
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {agentPaused ? "Paused" : "Active"}
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {["config", "draft", "activity", "performance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "draft" ? "Generate" : tab}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[600px] overflow-y-auto">
          {activeTab === "config" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Target URL</label>
                <input
                  type="text"
                  value={config.target_url}
                  onChange={(e) => setConfig({ ...config, target_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Niche</label>
                <input
                  type="text"
                  value={config.niche}
                  onChange={(e) => setConfig({ ...config, niche: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Max Daily Replies</label>
                <input
                  type="number"
                  value={config.max_daily_replies}
                  onChange={(e) => setConfig({ ...config, max_daily_replies: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
              >
                {saved ? "Saved!" : "Save Configuration"}
              </button>
            </div>
          )}

          {activeTab === "draft" && (
            <div className="space-y-4">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
              >
                {generating ? "Generating..." : "Generate Reply"}
              </button>
              {generatedReply && (
                <div className="space-y-2">
                  <textarea
                    value={generatedReply}
                    readOnly
                    className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                  <button
                    onClick={handleCopy}
                    className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition"
                  >
                    Copy Reply
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-3">
              {mockRecentPosts.slice(0, 3).map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-600 mt-1">Status: {post.status}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Posts Found Today</p>
                  <p className="text-2xl font-bold text-orange-600">{mockStats.posts_found_today}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Replies Posted</p>
                  <p className="text-2xl font-bold text-emerald-600">{mockStats.replies_posted_today}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-blue-600">{mockStats.total_clicks}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Approval Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{mockStats.approval_rate}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
