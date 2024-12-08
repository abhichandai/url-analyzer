import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    const result = await redis.get(`results:${sessionId}`);
    res.status(200).json({ result: result ? JSON.parse(result) : null });
  } catch (error) {
    console.error('Redis error:', error);
    res.status(500).json({ error: 'Failed to check results' });
  }
}