import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    // Store results with 30 minute expiration
    await redis.setex(`results:${sessionId}`, 1800, JSON.stringify(req.body));
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Redis error:', error);
    res.status(500).json({ error: 'Failed to store results' });
  }
}