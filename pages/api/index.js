import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    URL: '',
    'Primary Keyword': ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
    <main className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Product URL</label>
            <input
              type="url"
              className="w-full p-2 border rounded"
              value={formData.URL}
              onChange={(e) => setFormData(prev => ({...prev, URL: e.target.value}))}
              required
            />
          </div>

          <div>
            <label className="block mb-2">Primary Keyword</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData['Primary Keyword']}
              onChange={(e) => setFormData(prev => ({...prev, 'Primary Keyword': e.target.value}))}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            {loading ? 'Processing...' : 'Analyze'}
          </button>
        </form>
      </div>
    </main>
  );
}