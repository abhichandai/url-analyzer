import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionId = crypto.randomUUID();
    console.log('Analyze endpoint - Generated sessionId:', sessionId);
    
    await fetch('https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-ac1ce9f9-5989-4521-b5fe-97412ed4d58a', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...req.body,
        sessionId
      })
    });

    // Send back sessionId
    res.status(200).json({ sessionId });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
}