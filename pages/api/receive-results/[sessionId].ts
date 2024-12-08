import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory storage (replace with Redis/DB in production)
const results = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Store the results from Zapier
    results.set(req.query.sessionId, req.body);
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to store results' });
  }
}