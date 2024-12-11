import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query;
  console.log('----ZAPIER WEBHOOK START----');
  console.log('1. SessionId:', sessionId);
  console.log('2. Request body:', JSON.stringify(req.body, null, 2));

  try {
    // Test Redis connection
    console.log('3. Testing Redis connection...');
    const pingResult = await redis.ping();
    console.log('4. Redis ping result:', pingResult);

    // Store data
    const key = `results:${sessionId}`;
    console.log('5. Attempting to store with key:', key);
    console.log('6. Data to store:', JSON.stringify(req.body, null, 2));
    
    await redis.set(key, JSON.stringify(req.body));
    console.log('7. Storage command sent');

    // Verify storage
    const storedData = await redis.get(key);
    console.log('8. Data verification:', storedData ? 'Data found' : 'No data found');
    console.log('----ZAPIER WEBHOOK END----');

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: String(error) });
  }
}