import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="pt-20 pb-16 px-5 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-semibold mb-6">
          <span>⚙️</span>
          ClickSendAI Browser Extension
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight max-w-3xl mx-auto">
          AI-Powered Reddit & Quora
          <span className="block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mt-1">
            Forum Reply Agent
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          An intelligent browser extension that automatically scans Reddit and Quora for relevant topics, generates AI-powered replies, and posts them to grow your business.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate("/onboarding")}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/popup")}
            className="px-6 py-2 bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 rounded-lg font-medium transition"
          >
            Open Popup
          </button>
        </div>
      </div>
    </div>
  );
}
