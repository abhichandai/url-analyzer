import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Generate a session ID
    const sessionId = crypto.randomUUID();

    // Send to Clay with sessionId
    await fetch('https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-db7d0eeb-5854-4f24-ab5d-29de76efda46', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...req.body,
        sessionId
      })
    });

    // Return the sessionId to the client
    res.status(200).json({ sessionId });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
}