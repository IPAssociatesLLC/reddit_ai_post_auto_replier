import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [redditConnected, setRedditConnected] = useState(false);
  const [quoraConnected, setQuoraConnected] = useState(false);

  const handleNextStep = () => {
    if (step < 4) setStep(step + 1);
    else navigate("/popup");
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Setup Your Forum Agent</h1>
              <p className="text-sm text-gray-600 mt-1">Complete these 4 steps to get started with AI-powered Reddit & Quora replies</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{step}</p>
              <p className="text-xs text-gray-500">of 4</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition ${
                  s <= step ? "bg-red-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 min-h-[400px]">
          {step === 1 && (
            <div className="max-w-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Step 1: Verify Your Account</h2>
                <p className="text-sm text-gray-600">You're using your ClickSendAI account to run this forum agent. Your browser's Reddit and Quora logins are used to post replies—no API keys needed.</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>ℹ️</strong> Make sure you're logged into Reddit and Quora in this browser before continuing. The agent uses your existing login sessions to post replies.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Your ClickSendAI Account</p>
                <p className="text-sm text-gray-700 font-mono">you@example.com</p>
                <p className="text-xs text-gray-500 mt-2">Plan: Growth (Forum Agent enabled)</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Step 2: Connect Your Accounts</h2>
                <p className="text-sm text-gray-600">Verify that you're logged into Reddit and Quora. The agent will use your browser sessions.</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setRedditConnected(!redditConnected)}
                  className={`w-full px-4 py-4 rounded-lg border-2 font-medium transition text-left ${
                    redditConnected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${redditConnected ? "text-green-900" : "text-gray-900"}`}>
                        {redditConnected ? "✓ Reddit" : "🔴 Reddit"}
                      </p>
                      <p className={`text-xs mt-1 ${redditConnected ? "text-green-700" : "text-gray-600"}`}>
                        {redditConnected ? "Connected" : "Click to verify Reddit login"}
                      </p>
                    </div>
                    {redditConnected && <span className="text-green-600">✓</span>}
                  </div>
                </button>

                <button
                  onClick={() => setQuoraConnected(!quoraConnected)}
                  className={`w-full px-4 py-4 rounded-lg border-2 font-medium transition text-left ${
                    quoraConnected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${quoraConnected ? "text-green-900" : "text-gray-900"}`}>
                        {quoraConnected ? "✓ Quora" : "⬛ Quora"}
                      </p>
                      <p className={`text-xs mt-1 ${quoraConnected ? "text-green-700" : "text-gray-600"}`}>
                        {quoraConnected ? "Connected" : "Click to verify Quora login"}
                      </p>
                    </div>
                    {quoraConnected && <span className="text-green-600">✓</span>}
                  </div>
                </button>
              </div>

              <p className="text-xs text-gray-500">At least one platform must be connected to continue.</p>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Step 3: Configure Your Agent</h2>
                <p className="text-sm text-gray-600">Tell us about your business so the AI can generate relevant, on-brand replies.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Your Niche / Business</label>
                  <input
                    type="text"
                    placeholder="e.g., Fitness Coaching, Online Community, SaaS"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">What Keywords Should We Monitor?</label>
                  <textarea
                    placeholder="e.g., online community, fitness coaching, how to grow a membership, passive income, affiliate marketing..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Your Website / Link to Promote</label>
                  <input
                    type="text"
                    placeholder="https://yoursite.com or https://www.skool.com/your-group"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Step 4: You're Ready!</h2>
                <p className="text-sm text-gray-600">Your forum agent is configured and ready to start scanning Reddit and Quora.</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-3">
                <p className="text-2xl">✓</p>
                <p className="text-lg font-bold text-green-900">Setup Complete</p>
                <p className="text-sm text-green-700">
                  Your agent will start scanning for relevant posts and generating replies based on your configuration.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-900">What happens next:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Agent scans Reddit and Quora every 5 minutes</li>
                  <li>✓ Finds posts matching your keywords</li>
                  <li>✓ Generates AI replies based on your tone & business</li>
                  <li>✓ Posts replies (or saves as drafts for review)</li>
                  <li>✓ Tracks clicks and leads back to your site</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handlePrevStep}
            disabled={step === 1}
            className="flex-1 px-4 py-2 border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-medium rounded-lg transition"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            disabled={step === 2 && !redditConnected && !quoraConnected}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
          >
            {step === 4 ? "Go to Dashboard" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
