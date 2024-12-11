import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    console.log('1. Received webhook for sessionId:', sessionId);
    console.log('2. Incoming data:', JSON.stringify(req.body, null, 2));

    // Test Redis connection
    console.log('3. Testing Redis connection...');
    await redis.ping();
    console.log('4. Redis connection successful');

    // Store data
    console.log('5. Attempting to store data in Redis...');
    await redis.setex(`results:${sessionId}`, 1800, JSON.stringify(req.body));
    console.log('6. Data stored in Redis successfully');

    // Verify storage
    console.log('7. Verifying data storage...');
    const storedData = await redis.get(`results:${sessionId}`);
    console.log('8. Retrieved data:', storedData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Failed to store results',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}