export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    console.log('=== START ZAPIER WEBHOOK ===');
    console.log('SessionId:', sessionId);
    console.log('Request body:', req.body);
    
    // Test Redis connection
    console.log('Testing Redis connection...');
    const ping = await redis.ping();
    console.log('Redis ping response:', ping);
    
    // Store data
    const key = `results:${sessionId}`;
    console.log('Storing data with key:', key);
    await redis.set(key, JSON.stringify(req.body));
    console.log('Data stored successfully');
    
    // Verify storage
    const stored = await redis.get(key);
    console.log('Verification - stored data:', stored);
    console.log('=== END ZAPIER WEBHOOK ===');

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Detailed webhook error:', error);
    res.status(500).json({ error: String(error) });
  }
}