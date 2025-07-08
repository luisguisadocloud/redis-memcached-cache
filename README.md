# 🧠 Redis + Memcached Cache API (POC)

This project is a **Proof of Concept (POC)** for implementing a two-layer cache using Redis and Memcached in a Node.js REST API. It demonstrates the cache-aside pattern and is intended as a learning and testing platform for modern backend caching strategies.

---

## 📁 Project Structure

```
redis-memcached-cache/
├── package.json
├── jest.config.js
├── src/
│   ├── app.ts                  # Main Express app entry point
│   ├── db/
│   │   └── productsDB.ts       # Simulated in-memory database for products
│   ├── routes/
│   │   ├── redisProduct.ts     # Express routes for Redis endpoints
│   │   └── memcachedProduct.ts # Express routes for Memcached endpoints
│   ├── services/
│   │   ├── redisClient.ts      # Redis client setup
│   │   ├── memcachedClient.ts  # Memcached client setup (promisified)
│   │   ├── redisProductService.ts     # Business logic for Redis cache
│   │   └── memcachedProductService.ts # Business logic for Memcached cache
│   └── __tests__/
│       ├── redisProductService.test.ts
│       └── memcachedProductService.test.ts
```

---

## 🎯 Objective

The main goal of this project is to demonstrate how to implement and compare Redis and Memcached as independent cache layers for a RESTful API, using the cache-aside pattern. This approach helps to:

- Reduce database load and latency.
- Improve response times by serving data from cache.
- Show how to invalidate and update cache entries on data changes.
- Provide a clear, separated educational example for each technology.

---

## 🚀 How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start Redis and Memcached (with Docker)

```bash
docker run -d --name redis -p 6379:6379 redis
docker run -d --name memcached -p 11211:11211 memcached
```

### 3. Run the server

```bash
npx tsx src/app.ts
```

The API will be available at `http://localhost:3000`.

---

## 🧩 API Endpoints

### Redis Endpoints
- **POST /redis/products**  
  Create a new product (cached in Redis).
- **GET /redis/products/:id**  
  Retrieve a product by ID (checks Redis cache).
- **PUT /redis/products/:id**  
  Update a product and invalidate its Redis cache.
- **DELETE /redis/products/:id**  
  Delete a product and remove it from Redis cache.

### Memcached Endpoints
- **POST /memcached/products**  
  Create a new product (cached in Memcached).
- **GET /memcached/products/:id**  
  Retrieve a product by ID (checks Memcached cache).
- **PUT /memcached/products/:id**  
  Update a product and invalidate its Memcached cache.
- **DELETE /memcached/products/:id**  
  Delete a product and remove it from Memcached cache.

---

## 🛠️ Key Concepts

- **Cache-Aside Pattern:**  
  Each endpoint first checks its respective cache (Redis or Memcached). If not found, it fetches from the database, then stores the result in cache for future requests.

- **TTL (Time To Live):**  
  Cached entries have a configurable expiration time (default: 5 minutes).

- **Serialization:**  
  Cached objects are stored as JSON strings.

- **Invalidation:**  
  When a product is updated or deleted, its cache entry is removed from the respective cache to ensure consistency.

- **Async/Await:**  
  All logic is implemented using async/await for clarity and modern best practices.

- **Error Handling:**  
  Professional error handling with a global Express middleware and detailed logs for each operation.

- **Separation of Concerns:**  
  Controllers, services, clients, and DB logic are fully decoupled.

- **Logging:**  
  Each cache operation (hit, miss, set, delete, error) is logged to the console for easy debugging and learning.

---

## 📝 Example Logs

```
[Redis] HIT for key: product:123
[Redis] MISS for key: product:123
[Redis] SET key: product:123
[Redis] DEL key after update: product:123
[Memcached] HIT for key: product:456
[Memcached] MISS for key: product:456
[Memcached] SET key: product:456
[Memcached] DEL key after delete: product:456
```

---

## 🧪 Testing

- **Unit tests** for both Redis and Memcached services are included using Jest.
- To run tests:

```bash
npm test
```

---

## 📚 What This POC Demonstrates

- How to implement and compare Redis and Memcached as cache layers.
- The cache-aside pattern in practice.
- How to handle cache invalidation and TTL.
- The importance of serialization, consistency, and logging in distributed caching.
- How to structure a Node.js backend with clear separation of concerns and professional error handling.

---

## ✅ Prerequisites

- Node.js v18+
- Docker (for Redis and Memcached)
- curl or Postman (for testing)

---

## 👨‍💻 Author

Luis Guisado – [luisguisado.cloud](https://luisguisado.cloud) 