export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request body:', req.body);
    
    const clayResponse = await fetch('https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-db7d0eeb-5854-4f24-ab5d-29de76efda46', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        URL: req.body.URL,
        'Primary Keyword': req.body['Primary Keyword']
      })
    });

    console.log('Clay status:', clayResponse.status);
    
    if (!clayResponse.ok) {
      const errorText = await clayResponse.text();
      console.error('Clay error:', errorText);
      throw new Error(`Clay API failed: ${clayResponse.status}`);
    }
    
    const data = await clayResponse.json();
    console.log('Clay response data:', data);

    const result = {
      'Current Product Name': data['Current Product Name'] || '',
      'Clean Title': data['Clean Title'] || '',
      'Clean Desc.': data['Clean Desc.'] || '',
      'Clean H1 Tag': data['Clean H1 Tag'] || ''
    };

    console.log('Sending result:', result);
    res.status(200).json(result);
  } catch (err) {
    console.error('Detailed error:', err);
    res.status(500).json({ 
      error: err.message,
      details: err.toString()
    });
  }
}