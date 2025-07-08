import { createClient } from 'redis';

const client = createClient();
client.connect().catch((err) => console.error('Redis connection error:', err));

client.on('error', (err) => console.error('Redis error:', err));

export default client;
