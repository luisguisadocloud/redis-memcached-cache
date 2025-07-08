import express from 'express';
import redisProductRoutes from './routes/redisProduct';
import memcachedProductRoutes from './routes/memcachedProduct';

const app = express();
app.use(express.json());

app.use('/redis/products', redisProductRoutes);
app.use('/memcached/products', memcachedProductRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
