import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    URL: '',
    'Primary Keyword': ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6">URL Analyzer</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? 'Processing...' : 'Analyze'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}