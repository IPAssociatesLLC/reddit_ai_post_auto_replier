import { useState } from "react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [platformEmail, setPlatformEmail] = useState("");
  const [redditConnected, setRedditConnected] = useState(false);
  const [quoraConnected, setQuoraConnected] = useState(false);

  const steps = [
    { number: 1, label: "Connect" },
    { number: 2, label: "Accounts" },
    { number: 3, label: "Configure" },
    { number: 4, label: "Activate" },
  ];

  const handleNextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Setup Forum Agent</h1>
          <p className="text-sm text-gray-600 mt-1">Step {step} of 4</p>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex gap-2">
            {steps.map((s) => (
              <div
                key={s.number}
                className={`flex-1 h-2 rounded-full transition ${
                  s.number <= step ? "bg-orange-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Connect Your Account</h2>
              <p className="text-sm text-gray-600">Enter your ClickSendAI email to get started</p>
              <input
                type="email"
                placeholder="you@example.com"
                value={platformEmail}
                onChange={(e) => setPlatformEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Connect Accounts</h2>
              <p className="text-sm text-gray-600">Connect your Reddit and Quora accounts</p>
              <div className="space-y-3">
                <button
                  onClick={() => setRedditConnected(!redditConnected)}
                  className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition ${
                    redditConnected
                      ? "border-orange-600 bg-orange-50 text-orange-600"
                      : "border-gray-300 bg-white text-gray-600 hover:border-orange-600"
                  }`}
                >
                  {redditConnected ? "✓ Reddit Connected" : "Connect Reddit"}
                </button>
                <button
                  onClick={() => setQuoraConnected(!quoraConnected)}
                  className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition ${
                    quoraConnected
                      ? "border-orange-600 bg-orange-50 text-orange-600"
                      : "border-gray-300 bg-white text-gray-600 hover:border-orange-600"
                  }`}
                >
                  {quoraConnected ? "✓ Quora Connected" : "Connect Quora"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Configure Agent</h2>
              <p className="text-sm text-gray-600">Set up your agent's keywords and preferences</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Niche</label>
                  <input
                    type="text"
                    placeholder="e.g., Fitness Coaching"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Keywords (comma separated)</label>
                  <input
                    type="text"
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">All Set!</h2>
              <p className="text-sm text-gray-600">Your forum agent is ready to start scanning and posting</p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-emerald-700">Setup Complete</p>
                <p className="text-xs text-emerald-600 mt-1">The agent will start scanning forums automatically</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handlePrevStep}
            disabled={step === 1}
            className="flex-1 px-4 py-2 border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 rounded-lg font-medium transition"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            disabled={step === 4}
            className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
          >
            {step === 4 ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
