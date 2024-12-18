import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AnalysisResult {
  'Current Product Name': string;
  'Clean Title': string;
  'Clean Desc.': string;
  'Clean H1 Tag': string;
  'Opt. Title 1': string;
  'Opt. Title 2': string;
  'Opt. Title 3': string;
  'Opt. Desc 1': string;
  'Opt. Desc 2': string;
  'Opt. Desc 3': string;
  'Opt. H1': string;
  [key: string]: string; // Add index signature for dynamic access
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
      return;
    }

    console.log('Starting polling with sessionId:', sessionId);
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-results/${sessionId}`);
        console.log('Polling response status:', response.status);
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

    return () => {
      console.log('Cleaning up poll interval');
      clearInterval(pollInterval);
    };
  }, [sessionId, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);  // Set loading first
    setResult(null);
    setSessionId(null); // Reset sessionId
    
    try {
      console.log('Submitting form...');
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      console.log('Response from analyze:', data);
      
      if (data.sessionId) {
        setSessionId(data.sessionId);
        console.log('Set sessionId:', data.sessionId);
      } else {
        throw new Error('No sessionId received');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setLoading(false);
      setSessionId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6">URL Analyzer</h1>
          
          {/* Form Section */}
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

          {/* Current Information Section */}
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

          {/* SEO Optimized Information Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">SEO Optimized Information</h2>
            
            {/* Title Suggestions */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Title Suggestions</h3>
              <div className="space-y-2">
                {[1, 2, 3].map((num) => (
                  <div key={`title-${num}`} className="p-3 bg-gray-50 rounded border">
                    {loading ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      result?.[`Opt. Title ${num}` as keyof AnalysisResult] || '-'
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description Suggestions */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description Suggestions</h3>
              <div className="space-y-2">
                {[1, 2, 3].map((num) => (
                  <div key={`desc-${num}`} className="p-3 bg-gray-50 rounded border">
                    {loading ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      result?.[`Opt. Desc ${num}` as keyof AnalysisResult] || '-'
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* H1 Tag Suggestion */}
            <div>
              <h3 className="text-lg font-medium mb-2">H1 Tag Suggestion</h3>
              <div className="p-3 bg-gray-50 rounded border">
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  result?.['Opt. H1'] || '-'
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}