import { Router } from 'express';
import * as redisService from '../services/redisProductService';

const router = Router();

router.get('/:id', async (req, res, next) => {
  try {
    const result = await redisService.getProductById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ source: result.source, product: result.product });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const product = await redisService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const product = await redisService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await redisService.deleteProduct(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router; 