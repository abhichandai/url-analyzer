import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // This endpoint will be called by Zapier to store results
    // For now, return no results
    res.status(200).json({ result: null });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check results' });
  }
}