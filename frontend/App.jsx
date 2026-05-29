import { useState } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAudit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResult('')

    try {
      // Calls your local FastAPI backend
      const response = await fetch('http://localhost:8080/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.ERROR_MESSAGE) {
        setError(data.ERROR_MESSAGE)
      } else {
        setResult(data.audit_result)
      }
    } catch (err) {
      setError('Connection failed. Ensure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 font-mono p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl mt-12">
        
        <header className="mb-12 border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold tracking-tight">&gt; WATCHDOG &amp;.</h1>
          <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">County Budget Cross-Reference Protocol</p>
        </header>

        <form onSubmit={handleAudit} className="flex gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter ward (e.g., Kileleshwa)"
            className="flex-1 bg-gray-900 border border-gray-700 p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black font-bold px-8 py-4 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            {loading ? 'AUDITING...' : 'EXECUTE'}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 p-6">
            <p className="font-bold mb-2">[SYSTEM ERROR]</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-900 border border-gray-700 p-8 shadow-2xl animate-fade-in">
            <h2 className="text-white font-bold text-xl mb-4 uppercase border-b border-gray-800 pb-2">Audit Report</h2>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default App