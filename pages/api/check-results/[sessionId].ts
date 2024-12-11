import type { NextApiRequest, NextApiResponse } from 'next';
import { getKey } from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    console.log('1. Checking results for sessionId:', sessionId);
    
    const data = await getKey(`results:${sessionId}`);
    console.log('2. Raw Redis response:', data);

    if (data && data.result) {
      // data.result is already our JSON string
      console.log('3. Found data:', data.result);
      res.status(200).json({ result: JSON.parse(data.result) });
    } else {
      console.log('4. No data found');
      res.status(200).json({ result: null });
    }
  } catch (error) {
    console.error('5. Error:', error);
    res.status(500).json({ error: String(error) });
  }
}