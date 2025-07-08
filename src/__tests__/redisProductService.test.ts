import * as redisService from '../services/redisProductService';
import * as db from '../db/productsDB';

describe('Redis Product Service', () => {
  let productId: string;

  it('should create and get a product (cache miss, then hit)', async () => {
    const product = await redisService.createProduct({ name: 'Test', stock: 10 });
    productId = product.id;
    // First fetch: should come from DB
    const result1 = await redisService.getProductById(productId);
    expect(result1.source).toBe('db');
    expect(result1.product.name).toBe('Test');
    // Second fetch: should come from Redis
    const result2 = await redisService.getProductById(productId);
    expect(result2.source).toBe('redis');
    expect(result2.product.name).toBe('Test');
  });

  it('should update and invalidate cache', async () => {
    await redisService.updateProduct(productId, { stock: 20 });
    const result = await redisService.getProductById(productId);
    expect(result.source).toBe('db');
    expect(result.product.stock).toBe(20);
  });

  it('should delete and remove from cache', async () => {
    await redisService.deleteProduct(productId);
    const result = await redisService.getProductById(productId);
    expect(result).toBeNull();
  });
}); 