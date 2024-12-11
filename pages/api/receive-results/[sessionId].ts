import type { NextApiRequest, NextApiResponse } from 'next';
import { setKey } from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    console.log('----ZAPIER WEBHOOK START----');
    console.log('1. SessionId:', sessionId);
    console.log('2. Request body:', JSON.stringify(req.body, null, 2));

    // Store data
    const key = `results:${sessionId}`;
    console.log('3. Attempting to store with key:', key);
    
    // Send response immediately to prevent timeout
    res.status(200).json({ success: true });

    // Store data after response
    await setKey(key, JSON.stringify(req.body));
    console.log('4. Data stored successfully');
    console.log('----ZAPIER WEBHOOK END----');

  } catch (error) {
    console.error('Detailed error:', error);
    // Only send error if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({ error: String(error) });
    }
  }
}