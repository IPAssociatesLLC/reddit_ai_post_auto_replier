import { useState } from "react";
import { mockAgentConfig, mockConnectionStatus, mockRecentPosts, mockStats } from "@/mocks/extension";

export default function Popup() {
  const [activeTab, setActiveTab] = useState("config");
  const [platform, setPlatform] = useState("reddit");
  const [forumPost, setForumPost] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedReply(
        "The biggest shift for me was getting serious about showing up where my clients already hang out online. " +
        "I combined consistent content with a landing page that captures emails, then drove traffic straight to my coaching program. " +
        "If you're in fitness coaching specifically, this community has been a huge resource for referrals and networking — " +
        "definitely worth checking out: " + mockAgentConfig.target_url
      );
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Reddit & Quora AI Agent</h1>
            <p className="text-sm text-gray-500 mt-1">Generate humanlike, on-brand replies to relevant Reddit and Quora posts that naturally promote your link.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">Add-on</span>
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg">Resume Agent</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-xs text-gray-500 mt-1">Posted Replies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">0</div>
            <div className="text-xs text-gray-500 mt-1">Drafts Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">0</div>
            <div className="text-xs text-gray-500 mt-1">Total Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs text-gray-500 mt-1">Leads</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {[
            { id: "config", label: "Configuration" },
            { id: "draft", label: "Draft Reply" },
            { id: "activity", label: "Activity Log" },
            { id: "performance", label: "Performance" },
            { id: "tracking", label: "Tracking & Leads" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? "text-red-600 border-b-red-600"
                  : "text-gray-600 border-b-transparent hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {activeTab === "config" && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>💡 How it works:</strong> Save your URL, niche, and tone here. Then go to Draft Reply, paste a Reddit or Quora question, and the AI generates a humanlike reply that naturally weaves in your link.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL to Promote</label>
                <p className="text-xs text-gray-500 mb-2">Your group, membership, business, or affiliate link</p>
                <input
                  type="text"
                  placeholder="https://yoursite.com or https://www.skool.com/your-group"
                  defaultValue={mockAgentConfig.target_url}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niche Keywords & Topics</label>
                <p className="text-xs text-gray-500 mb-2">What's your business about?</p>
                <textarea
                  placeholder="e.g., online community, fitness coaching, how to grow a membership, passive income, affiliate marketing..."
                  defaultValue={mockAgentConfig.keywords.join(", ")}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subreddits to Monitor</label>
                  <p className="text-xs text-gray-500 mb-2">(optional)</p>
                  <textarea
                    placeholder="r/entrepreneur, r/fitness, r/onlinebusiness..."
                    defaultValue={mockAgentConfig.subreddits.join(", ")}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reply Tone</label>
                  <select defaultValue={mockAgentConfig.reply_tone} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option>Helpful & Informative</option>
                    <option>Casual & Friendly</option>
                    <option>Professional & Expert</option>
                    <option>Motivational & Inspiring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quora Topics</label>
                <textarea
                  placeholder="Online Business, Fitness, Coaching, Community Building..."
                  defaultValue={mockAgentConfig.quora_topics.join(", ")}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <button className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg">Save Configuration</button>
            </div>
          )}

          {activeTab === "draft" && (
            <div className="max-w-2xl space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  <strong>✨ Paste any Reddit or Quora question and the AI will craft a humanlike, helpful reply that naturally mentions your link. Copy it and post it on the platform.</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPlatform("reddit")}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 font-medium text-sm ${
                        platform === "reddit"
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      🔴 Reddit
                    </button>
                    <button
                      onClick={() => setPlatform("quora")}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 font-medium text-sm ${
                        platform === "quora"
                          ? "border-gray-600 bg-gray-100 text-gray-900"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      ⬛ Quora
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subreddit</label>
                  <p className="text-xs text-gray-500 mb-1">(optional)</p>
                  <input type="text" placeholder="r/entrepreneur" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forum Post / Question</label>
                <textarea
                  placeholder="Paste the full text of the Reddit post or Quora question you want to reply to..."
                  value={forumPost}
                  onChange={(e) => setForumPost(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !forumPost}
                className="w-full px-4 py-2 bg-red-400 hover:bg-red-500 disabled:bg-gray-300 text-white font-medium rounded-lg transition"
              >
                {generating ? "Generating..." : "✨ Generate AI Reply"}
              </button>

              {generatedReply && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Generated Reply:</p>
                  <p className="text-sm text-gray-800 leading-relaxed">{generatedReply}</p>
                  <button className="mt-3 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg">Copy to Clipboard</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="max-w-2xl text-center py-12">
              <p className="text-gray-500">No activity yet. Connect your agent to see found posts and replies.</p>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="max-w-3xl space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600 mt-1">Total Replies</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-cyan-600">0</p>
                  <p className="text-sm text-gray-600 mt-1">Total Clicks</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600 mt-1">Total Leads</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">0 / 10</p>
                  <p className="text-sm text-gray-600 mt-1">Daily Limit</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-medium text-red-900 mb-3">📊 Posts Found Today</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded px-3 py-2 text-center">
                    <p className="text-xs text-gray-600">0 Reddit</p>
                  </div>
                  <div className="bg-pink-100 rounded px-3 py-2 text-center">
                    <p className="text-xs text-gray-600">0 Quora</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">🔗 Tracking Links</p>
                <p className="text-xs text-gray-600">UTM tagged links are auto-generated for each post. Click data and leads are tracked back to your platform.</p>
              </div>
            </div>
          )}

          {activeTab === "tracking" && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">🔗 Tracking Links</h3>
                <p className="text-xs text-gray-600 mb-3">UTM tagged links from posted replies</p>
                <p className="text-sm text-gray-500 text-center py-8">No tracking links yet. Post replies with UTM links will appear here with click data.</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">👥 Leads from Forum Posts</h3>
                <p className="text-xs text-gray-600 mb-3">People who clicked your link and opted in</p>
                <p className="text-sm text-gray-500 text-center py-8">No leads captured yet. When someone clicks your tracking link and opts in, they will appear here with their click data.</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-600 mt-1">Total Clicks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-xs text-gray-600 mt-1">Total Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">0%</p>
                  <p className="text-xs text-gray-600 mt-1">Conversion Rate</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
