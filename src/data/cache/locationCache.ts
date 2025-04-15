
// Cache duration constants
export const CACHE_DURATIONS = {
  PROVINCES: 30 * 60 * 1000, // 30 minutes
  CITIES: 5 * 60 * 1000,     // 5 minutes (reduced from 15)
  STORAGE_CHECK: 10 * 60 * 1000, // 10 minutes (reduced from 60)
};

// Cache keys
export const getCitiesCacheKey = (provinceValue: string, storageOnly: boolean): string => 
  `cities-api-${provinceValue}-${storageOnly ? 'storage' : 'all'}`;

export const getStorageCheckCacheKey = (provincia: string, ciudad: string): string => 
  `storage-check-${provincia}-${ciudad}`;

// Generic cache getter function
export function getFromCache<T>(key: string): { data: T; timestamp: number } | null {
  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) return null;
    
    return JSON.parse(cachedItem);
  } catch (error) {
    console.error(`Error parsing cached item for key ${key}:`, error);
    // If there's an error, clear the cache item
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore error if localStorage is not available
    }
    return null;
  }
}

// Generic cache setter function
export function setToCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error(`Error storing item in cache for key ${key}:`, error);
  }
}

// Check if cache is valid based on TTL
export function isCacheValid(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp < ttl;
}

// Clear all location-related cache
export function clearLocationCache(): void {
  try {
    // Get all cache keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('cities-api-') || key.startsWith('storage-check-'))) {
        localStorage.removeItem(key);
      }
    }
    console.log('Location cache cleared');
  } catch (error) {
    console.error('Error clearing location cache:', error);
  }
}
