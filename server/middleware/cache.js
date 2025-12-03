// middleware/cache.js
import NodeCache from 'node-cache';

// Create cache instance with default TTL of 5 minutes
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes default
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false // Don't clone data for better performance
});

/**
 * Cache middleware factory
 * @param {number} duration - Cache duration in seconds (default: 300)
 * @returns {Function} Express middleware
 */
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      // Cache hit
      res.set('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    // Cache miss - store original json method
    const originalJson = res.json.bind(res);
    
    res.json = (body) => {
      // Store in cache
      cache.set(key, body, duration);
      res.set('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
};

/**
 * Invalidate cache for specific pattern
 * @param {string} pattern - URL pattern to invalidate
 */
export const invalidateCache = (pattern) => {
  const keys = cache.keys();
  const keysToDelete = keys.filter(key => key.includes(pattern));
  keysToDelete.forEach(key => cache.del(key));
  return keysToDelete.length;
};

/**
 * Clear all cache
 */
export const clearCache = () => {
  cache.flushAll();
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return cache.getStats();
};

export default cache;
