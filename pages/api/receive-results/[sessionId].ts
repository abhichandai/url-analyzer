import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    
    // Set shorter timeout and immediate response
    const storePromise = redis.setex(`results:${sessionId}`, 1800, JSON.stringify(req.body));
    
    // Respond immediately without waiting for Redis
    res.status(200).json({ success: true });
    
    // Let Redis operation complete in background
    await storePromise;
  } catch (error) {
    console.error('Redis error:', error);
    // Only send error if we haven't sent response yet
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to store results' });
    }
  }
}