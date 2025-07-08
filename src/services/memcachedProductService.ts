import { memcachedGet, memcachedSet, memcachedDel } from './memcachedClient';
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
    const cached = await memcachedGet(key);
    if (cached) {
      console.log(`[Memcached] HIT for key: ${key}`);
      return { source: 'memcached', product: JSON.parse(cached) };
    }
    console.log(`[Memcached] MISS for key: ${key}`);
    const product = await getProductFromDB(id);
    if (!product) return null;
    await memcachedSet(key, JSON.stringify(product), TTL);
    console.log(`[Memcached] SET key: ${key}`);
    return { source: 'db', product };
  } catch (error) {
    console.error(`[Memcached] ERROR for key: ${key}`, error);
    throw new Error('Memcached service error: ' + error);
  }
}

export async function createProduct(data: any) {
  try {
    const product = await saveProductToDB(data);
    console.log(`[Memcached] Created product with id: ${product.id}`);
    return product;
  } catch (error) {
    console.error('[Memcached] Create product error', error);
    throw new Error('Create product error: ' + error);
  }
}

export async function updateProduct(id: string, data: any) {
  const key = `product:${id}`;
  try {
    const product = await updateProductInDB(id, data);
    await memcachedDel(key);
    console.log(`[Memcached] DEL key after update: ${key}`);
    return product;
  } catch (error) {
    console.error(`[Memcached] Update product error for id: ${id}`, error);
    throw new Error('Update product error: ' + error);
  }
}

export async function deleteProduct(id: string) {
  const key = `product:${id}`;
  try {
    await deleteProductFromDB(id);
    await memcachedDel(key);
    console.log(`[Memcached] DEL key after delete: ${key}`);
  } catch (error) {
    console.error(`[Memcached] Delete product error for id: ${id}`, error);
    throw new Error('Delete product error: ' + error);
  }
} 