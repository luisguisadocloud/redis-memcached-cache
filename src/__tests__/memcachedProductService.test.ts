import * as memcachedService from '../services/memcachedProductService';
import * as db from '../db/productsDB';

describe('Memcached Product Service', () => {
  let productId: string;

  it('should create and get a product (cache miss, then hit)', async () => {
    const product = await memcachedService.createProduct({ name: 'Test', stock: 10 });
    productId = product.id;
    // First fetch: should come from DB
    const result1 = await memcachedService.getProductById(productId);
    expect(result1.source).toBe('db');
    expect(result1.product.name).toBe('Test');
    // Second fetch: should come from Memcached
    const result2 = await memcachedService.getProductById(productId);
    expect(result2.source).toBe('memcached');
    expect(result2.product.name).toBe('Test');
  });

  it('should update and invalidate cache', async () => {
    await memcachedService.updateProduct(productId, { stock: 20 });
    const result = await memcachedService.getProductById(productId);
    expect(result.source).toBe('db');
    expect(result.product.stock).toBe(20);
  });

  it('should delete and remove from cache', async () => {
    await memcachedService.deleteProduct(productId);
    const result = await memcachedService.getProductById(productId);
    expect(result).toBeNull();
  });
}); 