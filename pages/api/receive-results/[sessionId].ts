try {
  const { sessionId } = req.query;
  console.log('Received data for sessionId:', sessionId);
  console.log('Data:', req.body);
  
  const storePromise = redis.setex(`results:${sessionId}`, 1800, JSON.stringify(req.body));
  res.status(200).json({ success: true });
  await storePromise;
} catch (error) {
  console.error('Redis error:', error);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Failed to store results' });
  }
}