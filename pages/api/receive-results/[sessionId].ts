import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    console.log('Storing data for sessionId:', sessionId);
    
    const key = `results:${sessionId}`;
    const value = JSON.stringify(req.body);
    
    await redis.set(key, value, 'EX', 1800); // 30 minute expiry
    console.log('Data stored successfully');
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Storage error:', error);
    res.status(500).json({ error: String(error) });
  }
}