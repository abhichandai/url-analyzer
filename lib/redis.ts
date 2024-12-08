import { Redis } from 'ioredis';

// Your Upstash Redis connection URL from the dashboard
const redis = new Redis(process.env.REDIS_URL);

export default redis;