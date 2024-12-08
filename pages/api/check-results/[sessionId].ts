try {
  const { sessionId } = req.query;
  console.log('Checking results for sessionId:', sessionId);
  const result = await redis.get(`results:${sessionId}`);
  console.log('Found result:', result);
  res.status(200).json({ result: result ? JSON.parse(result) : null });
} catch (error) {
  console.error('Redis error:', error);
  res.status(500).json({ error: 'Failed to check results' });
}