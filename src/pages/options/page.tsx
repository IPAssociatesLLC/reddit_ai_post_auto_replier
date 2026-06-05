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
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="w-full max-w-[600px] bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        </div>

        <div className="flex border-b border-gray-200">
          {["agent", "accounts", "advanced"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition ${
                activeSection === section
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {section === "agent" ? "Agent Config" : section}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[500px] overflow-y-auto">
          {activeSection === "agent" && (
            <div className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-900 mb-2">Business Description</label>
                <textarea
                  value={config.business_description}
                  onChange={(e) => setConfig({ ...config, business_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Reply Tone</label>
                <select
                  value={config.reply_tone}
                  onChange={(e) => setConfig({ ...config, reply_tone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option>Helpful & Informative</option>
                  <option>Casual & Friendly</option>
                  <option>Professional & Expert</option>
                  <option>Motivational & Inspiring</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto_post"
                  checked={config.auto_post}
                  onChange={(e) => setConfig({ ...config, auto_post: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="auto_post" className="text-sm text-gray-900">Auto-post replies</label>
              </div>
            </div>
          )}

          {activeSection === "accounts" && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Connected Accounts</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reddit</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${mockConnectionStatus.reddit_connected ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {mockConnectionStatus.reddit_connected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quora</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${mockConnectionStatus.quora_connected ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {mockConnectionStatus.quora_connected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "advanced" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Scan Frequency (minutes)</label>
                <input
                  type="number"
                  value={config.scan_frequency_minutes}
                  onChange={(e) => setConfig({ ...config, scan_frequency_minutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Reply Delay (minutes)</label>
                <input
                  type="number"
                  value={config.reply_delay_minutes}
                  onChange={(e) => setConfig({ ...config, reply_delay_minutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
          >
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
