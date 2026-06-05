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
 
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header, Progress, 4 Steps, Navigation */}
      </div>
    </div>
  );
}
