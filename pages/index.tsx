import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AnalysisResult {
  'Current Product Name': string;
  'Clean Title': string;
  'Clean Desc.': string;
  'Clean H1 Tag': string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    URL: '',
    'Primary Keyword': ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Poll for results when we have a sessionId
useEffect(() => {
  if (!sessionId || !loading) {
    console.log('Not polling:', { sessionId, loading });
    return;
  }

  console.log('Starting to poll with sessionId:', sessionId);
  
  const pollInterval = setInterval(async () => {
    try {
      console.log('Polling attempt for sessionId:', sessionId);
      const response = await fetch(`/api/check-results/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Poll response:', data);
        if (data.result) {
          setResult(data.result);
          setLoading(false);
          clearInterval(pollInterval);
        }
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, 5000);

  return () => clearInterval(pollInterval);
}, [sessionId, loading]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setResult(null);
  
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) throw new Error('Analysis failed');
    const data = await response.json();
    console.log('Generated sessionId:', data.sessionId);
    setSessionId(data.sessionId);
  } catch (err) {
    console.error(err);
    setLoading(false); // Only set loading to false on error
  }
};

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6">URL Analyzer</h1>
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Product URL</label>
              <input
                type="url"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData.URL}
                onChange={(e) => setFormData(prev => ({...prev, URL: e.target.value}))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Keyword</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={formData['Primary Keyword']}
                onChange={(e) => setFormData(prev => ({...prev, 'Primary Keyword': e.target.value}))}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" />
                  Analyzing...
                </span>
              ) : (
                'Analyze'
              )}
            </button>
          </form>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Current Information</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 bg-gray-50 border">Field</th>
                    <th className="text-left p-3 bg-gray-50 border w-3/4">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border font-medium">Product Name</td>
                    <td className="p-3 border">
                      {loading ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        result?.['Current Product Name'] || '-'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">Meta Title</td>
                    <td className="p-3 border">
                      {loading ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        result?.['Clean Title'] || '-'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">Meta Description</td>
                    <td className="p-3 border">
                      {loading ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        result?.['Clean Desc.'] || '-'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border font-medium">H1 Tag</td>
                    <td className="p-3 border">
                      {loading ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        result?.['Clean H1 Tag'] || '-'
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}