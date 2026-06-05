import { useState } from "react";
import { mockAgentConfig, mockConnectionStatus } from "@/mocks/extension";

export default function Options() {
  const [config, setConfig] = useState(mockAgentConfig);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("agent");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">Reddit & Quora AI Agent Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {[
            { id: "agent", label: "Agent Configuration" },
            { id: "accounts", label: "Connected Accounts" },
            { id: "advanced", label: "Advanced Settings" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeSection === tab.id
                  ? "text-gray-900 border-b-gray-900"
                  : "text-gray-600 border-b-transparent hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-w-2xl">
          {activeSection === "agent" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Your Niche / Business</label>
                <input
                  type="text"
                  value={config.niche}
                  onChange={(e) => setConfig({ ...config, niche: e.target.value })}
                  placeholder="e.g., Fitness Coaching, Online Community, SaaS"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Business Description</label>
                <p className="text-xs text-gray-500 mb-2">What do you do? Who do you help? How?</p>
                <textarea
                  value={config.business_description}
                  onChange={(e) => setConfig({ ...config, business_description: e.target.value })}
                  rows={4}
                  placeholder="I help fitness coaches build online communities and get more paying clients through Skool groups..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Reply Tone</label>
                <select
                  value={config.reply_tone}
                  onChange={(e) => setConfig({ ...config, reply_tone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option>Helpful & Informative</option>
                  <option>Casual & Friendly</option>
                  <option>Professional & Expert</option>
                  <option>Motivational & Inspiring</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="auto_post"
                  checked={config.auto_post}
                  onChange={(e) => setConfig({ ...config, auto_post: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <div>
                  <label htmlFor="auto_post" className="text-sm font-medium text-gray-900">Auto-post replies</label>
                  <p className="text-xs text-gray-500 mt-1">If enabled, replies post automatically. If disabled, they're saved as drafts for manual review.</p>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg"
              >
                {saved ? "Settings Saved ✓" : "Save Settings"}
              </button>
            </div>
          )}

          {activeSection === "accounts" && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Reddit</p>
                      <p className="text-xs text-gray-500 mt-1">Scan for posts matching your keywords on subreddits you choose</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      mockConnectionStatus.reddit_connected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {mockConnectionStatus.reddit_connected ? '✓ Connected' : 'Not Connected'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Quora</p>
                      <p className="text-xs text-gray-500 mt-1">Scan for questions matching your keywords on Quora topics</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      mockConnectionStatus.quora_connected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {mockConnectionStatus.quora_connected ? '✓ Connected' : 'Not Connected'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500">Your browser login is used to post replies. No API keys are stored. The extension uses your existing Reddit and Quora sessions.</p>
            </div>
          )}

          {activeSection === "advanced" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Scan Frequency</label>
                <p className="text-xs text-gray-500 mb-2">How often the agent checks for new posts</p>
                <select
                  defaultValue={config.scan_frequency_minutes}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value={5}>Every 5 minutes</option>
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={60}>Every hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Max Replies Per Day</label>
                <input
                  type="number"
                  defaultValue={config.max_daily_replies}
                  min={1}
                  max={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Reply Delay (Minutes)</label>
                <p className="text-xs text-gray-500 mb-2">Wait this long after finding a post before replying (to appear natural)</p>
                <input
                  type="number"
                  defaultValue={config.reply_delay_minutes}
                  min={0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg"
              >
                {saved ? "Settings Saved ✓" : "Save Settings"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
