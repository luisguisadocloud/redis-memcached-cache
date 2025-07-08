const Memcached = require('memcached');
import { promisify } from 'util';

const client = new Memcached('localhost:11211');

export const memcachedGet = promisify(client.get).bind(client);
export const memcachedSet = promisify(client.set).bind(client);
export const memcachedDel = promisify(client.del).bind(client);

export default client;
