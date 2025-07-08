import redisClient from './redisClient';
import {
  getProductFromDB,
  saveProductToDB,
  updateProductInDB,
  deleteProductFromDB
} from '../db/productsDB';

const TTL = 300; // 5 minutes

export async function getProductById(id: string) {
  const key = `product:${id}`;
  try {
    let cached = await redisClient.get(key);
    if (cached) {
      if (Buffer.isBuffer(cached)) cached = cached.toString('utf-8');
      console.log(`[Redis] HIT for key: ${key}`);
      return { source: 'redis', product: JSON.parse(cached) };
    }
    console.log(`[Redis] MISS for key: ${key}`);
    const product = await getProductFromDB(id);
    if (!product) return null;
    await redisClient.set(key, JSON.stringify(product), { EX: TTL });
    console.log(`[Redis] SET key: ${key}`);
    return { source: 'db', product };
  } catch (error) {
    console.error(`[Redis] ERROR for key: ${key}`, error);
    throw new Error('Redis service error: ' + error);
  }
}

export async function createProduct(data: any) {
  try {
    const product = await saveProductToDB(data);
    console.log(`[Redis] Created product with id: ${product.id}`);
    return product;
  } catch (error) {
    console.error('[Redis] Create product error', error);
    throw new Error('Create product error: ' + error);
  }
}

export async function updateProduct(id: string, data: any) {
  const key = `product:${id}`;
  try {
    const product = await updateProductInDB(id, data);
    await redisClient.del(key);
    console.log(`[Redis] DEL key after update: ${key}`);
    return product;
  } catch (error) {
    console.error(`[Redis] Update product error for id: ${id}`, error);
    throw new Error('Update product error: ' + error);
  }
}

export async function deleteProduct(id: string) {
  const key = `product:${id}`;
  try {
    await deleteProductFromDB(id);
    await redisClient.del(key);
    console.log(`[Redis] DEL key after delete: ${key}`);
  } catch (error) {
    console.error(`[Redis] Delete product error for id: ${id}`, error);
    throw new Error('Delete product error: ' + error);
  }
} 