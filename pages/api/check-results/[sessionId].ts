import type { NextApiRequest, NextApiResponse } from 'next';
import { getKey } from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    console.log('Checking results for sessionId:', sessionId);
    
    // Get data from Redis
    const rawResult = await getKey(`results:${sessionId}`);
    console.log('Raw Redis response:', rawResult);

    // The Upstash REST API returns the result in a specific format
    // If it's a string (our JSON data), it will be in result[1]
    const result = Array.isArray(rawResult) ? rawResult[1] : null;
    
    if (result) {
      // Parse the stored JSON string
      const parsedResult = JSON.parse(result);
      console.log('Parsed result:', parsedResult);
      res.status(200).json({ result: parsedResult });
    } else {
      res.status(200).json({ result: null });
    }
  } catch (error) {
    console.error('Check results error:', error);
    res.status(500).json({ error: 'Failed to check results' });
  }
}