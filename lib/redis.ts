import { Redis } from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: () => 2000,
  maxRetriesPerRequest: 10,
  connectTimeout: 10000,
  lazyConnect: true
});

// Log connection events
redis.on('connect', () => console.log('Redis Connected'));
redis.on('error', (err) => console.error('Redis Error:', err));

export default redis;