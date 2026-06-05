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
        {/* Header, Tabs, Agent Config, Accounts, Advanced, Save */}
      </div>
    </div>
  );
}
