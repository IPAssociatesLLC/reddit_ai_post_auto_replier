import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            setGeneratedReply("The biggest shift for me was getting serious about showing up where my clients already hang out online. " +
                "I combined consistent content with a landing page that captures emails, then drove traffic straight to my coaching program. " +
                "If you're in fitness coaching specifically, this community has been a huge resource for referrals and networking — " +
                "definitely worth checking out: " + config.target_url);
            setGenerating(false);
        }, 2000);
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(generatedReply);
    };
    return (_jsx("div", { className: "min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-[680px] bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden", children: [_jsxs("div", { className: "border-b border-gray-200 px-6 py-4 flex items-center justify-between", children: [_jsx("h1", { className: "text-lg font-semibold text-gray-900", children: "ClickSendAI Forum Agent" }), _jsx("button", { onClick: () => setAgentPaused(!agentPaused), className: `px-3 py-1 rounded-full text-xs font-medium transition ${agentPaused
                                ? "bg-red-50 text-red-700"
                                : "bg-emerald-50 text-emerald-700"}`, children: agentPaused ? "Paused" : "Active" })] }), _jsx("div", { className: "flex border-b border-gray-200", children: ["config", "draft", "activity", "performance"].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), className: `flex-1 px-4 py-3 text-sm font-medium capitalize transition ${activeTab === tab
                            ? "text-orange-600 border-b-2 border-orange-600"
                            : "text-gray-600 hover:text-gray-900"}`, children: tab === "draft" ? "Generate" : tab }, tab))) }), _jsxs("div", { className: "p-6 max-h-[600px] overflow-y-auto", children: [activeTab === "config" && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Target URL" }), _jsx("input", { type: "text", value: config.target_url, onChange: (e) => setConfig({ ...config, target_url: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Niche" }), _jsx("input", { type: "text", value: config.niche, onChange: (e) => setConfig({ ...config, niche: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-900 mb-2", children: "Max Daily Replies" }), _jsx("input", { type: "number", value: config.max_daily_replies, onChange: (e) => setConfig({ ...config, max_daily_replies: parseInt(e.target.value) }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" })] }), _jsx("button", { onClick: handleSave, className: "w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition", children: saved ? "Saved!" : "Save Configuration" })] })), activeTab === "draft" && (_jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: handleGenerate, disabled: generating, className: "w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition", children: generating ? "Generating..." : "Generate Reply" }), generatedReply && (_jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: generatedReply, readOnly: true, className: "w-full h-40 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" }), _jsx("button", { onClick: handleCopy, className: "w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition", children: "Copy Reply" })] }))] })), activeTab === "activity" && (_jsx("div", { className: "space-y-3", children: mockRecentPosts.slice(0, 3).map((post) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: post.title }), _jsxs("p", { className: "text-xs text-gray-600 mt-1", children: ["Status: ", post.status] })] }, post.id))) })), activeTab === "performance" && (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-orange-50 rounded-lg p-3", children: [_jsx("p", { className: "text-xs text-gray-600", children: "Posts Found Today" }), _jsx("p", { className: "text-2xl font-bold text-orange-600", children: mockStats.posts_found_today })] }), _jsxs("div", { className: "bg-emerald-50 rounded-lg p-3", children: [_jsx("p", { className: "text-xs text-gray-600", children: "Replies Posted" }), _jsx("p", { className: "text-2xl font-bold text-emerald-600", children: mockStats.replies_posted_today })] }), _jsxs("div", { className: "bg-blue-50 rounded-lg p-3", children: [_jsx("p", { className: "text-xs text-gray-600", children: "Total Clicks" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: mockStats.total_clicks })] }), _jsxs("div", { className: "bg-purple-50 rounded-lg p-3", children: [_jsx("p", { className: "text-xs text-gray-600", children: "Approval Rate" }), _jsxs("p", { className: "text-2xl font-bold text-purple-600", children: [mockStats.approval_rate, "%"] })] })] }) }))] })] }) }));
}
