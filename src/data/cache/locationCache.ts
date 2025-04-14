
// Cache duration constants
export const CACHE_DURATIONS = {
  PROVINCES: 30 * 60 * 1000, // 30 minutes
  CITIES: 15 * 60 * 1000,    // 15 minutes
  STORAGE_CHECK: 60 * 60 * 1000, // 1 hour
};

// Cache keys
export const getCitiesCacheKey = (provinceValue: string, storageOnly: boolean): string => 
  `cities-api-${provinceValue}-${storageOnly ? 'storage' : 'all'}`;

export const getStorageCheckCacheKey = (provincia: string, ciudad: string): string => 
  `storage-check-${provincia}-${ciudad}`;

// Generic cache getter function
export function getFromCache<T>(key: string): { data: T; timestamp: number } | null {
  const cachedItem = localStorage.getItem(key);
  if (!cachedItem) return null;
  
  try {
    return JSON.parse(cachedItem);
  } catch (error) {
    console.error(`Error parsing cached item for key ${key}:`, error);
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
