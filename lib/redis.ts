import { Redis } from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

const getRedisClient = () => {
  try {
    const client = new Redis(process.env.REDIS_URL as string);
    client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
    return client;
  } catch (error) {
    console.error('Redis initialization error:', error);
    throw error;
  }
};

const redis = getRedisClient();

export default redis;