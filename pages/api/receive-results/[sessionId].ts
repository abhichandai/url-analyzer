import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    console.log('=== START ZAPIER WEBHOOK ===');
    console.log('SessionId:', sessionId);
    
    // Respond immediately to prevent timeout
    res.status(200).json({ success: true });
    
    // Handle Redis operations after response
    const key = `results:${sessionId}`;
    console.log('Storing data with key:', key);
    await redis.set(key, JSON.stringify(req.body));
    console.log('Data stored in Redis');
    console.log('=== END ZAPIER WEBHOOK ===');

  } catch (error) {
    console.error('Webhook error:', error);
    // Only send error if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({ error: String(error) });
    }
  }
}