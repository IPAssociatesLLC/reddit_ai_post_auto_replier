import { useNavigate } from "react-router-dom";

export default function Architecture() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-900 font-medium">
          Back to Home
        </button>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">System Architecture</h1>
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Overview</h2>
              <p>This browser extension integrates with your ClickSendAI platform to automate Reddit and Quora forum posting with AI-generated replies.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Components</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Chrome Extension background service worker</li>
                <li>Reddit and Quora DOM scanners</li>
                <li>Supabase database integration</li>
                <li>Cloudflare Workers API backend</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Flow</h2>
              <p>User configures agent → Extension scans forums → AI generates replies → Posts to forums → Results stored in Supabase</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
