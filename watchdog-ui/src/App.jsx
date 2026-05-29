import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [query, setQuery] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const runAudit = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setReport('');

    try {
      // Calling your FastAPI backend
      const response = await fetch('https://watchdog-api-1021200580207.europe-west1.run.app/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      });

      const data = await response.json();
      setReport(data.audit_result || data.ERROR_MESSAGE);
    } catch (error) {
      setReport("## Connection Error\nThe Watchdog API is currently unreachable. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black font-mono p-8 selection:bg-black selection:text-white">
      <div className="max-w-3xl mx-auto border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Header Section */}
        <header className="mb-10 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-bold tracking-tighter uppercase">County Budget Watchdog</h1>
          <p className="text-sm mt-2 font-semibold">Track 04 // AI-Powered Financial Auditor</p>
        </header>

        {/* Input Form */}
        <form onSubmit={runAudit} className="mb-8">
          <label className="block text-sm font-bold mb-2 uppercase" htmlFor="query">
            Citizen Inquiry
          </label>
          <div className="flex gap-4">
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What is the original allocated budget for Kileleshwa?"
              className="flex-1 border-2 border-black p-3 outline-none focus:bg-gray-100 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white border-2 border-black px-8 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? 'Auditing...' : 'Run Audit'}
            </button>
          </div>
        </form>

        {/* Results Screen */}
        <div className="min-h-[300px] border-2 border-black bg-gray-50 p-6">
          {loading && (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-black rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-black rounded"></div>
                  <div className="h-4 bg-black rounded w-5/6"></div>
                </div>
              </div>
            </div>
          )}
          
          {!loading && report && (
            <div className="prose prose-p:text-black prose-headings:text-black prose-strong:text-black prose-li:text-black max-w-none">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          )}

          {!loading && !report && (
            <div className="text-gray-400 text-center mt-24 uppercase tracking-widest text-sm">
              Awaiting Document Context...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;