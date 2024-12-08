export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-db7d0eeb-5854-4f24-ab5d-29de76efda46', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) throw new Error('Clay API request failed');
    
    const data = await response.json();

    // Extract the fields we want from the Clay response
    const result = {
      'Current Product Name': data['Current Product Name'] || '',
      'Clean Title': data['Clean Title'] || '',
      'Clean Desc.': data['Clean Desc.'] || '',
      'Clean H1 Tag': data['Clean H1 Tag'] || ''
    };

    res.status(200).json(result);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
}