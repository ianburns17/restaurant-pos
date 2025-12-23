import AsyncStorage from '@react-native-async-storage/async-storage';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
}

interface MenuCache {
  data: MenuItem[];
  timestamp: number;
}

const MENU_CACHE_KEY = 'menu_cache';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Fetches menu items with 24-hour caching using AsyncStorage
 * @returns Promise<MenuItem[]> - Array of menu items
 */
export const fetchMenu = async (): Promise<MenuItem[]> => {
  try {
    // Check if valid cached data exists
    const cachedMenuJson = await AsyncStorage.getItem(MENU_CACHE_KEY);
    
    if (cachedMenuJson) {
      const cachedMenu: MenuCache = JSON.parse(cachedMenuJson);
      const now = Date.now();
      const cacheAge = now - cachedMenu.timestamp;
      
      // Return cached data if it's still fresh (less than 24 hours old)
      if (cacheAge < CACHE_DURATION_MS) {
        console.log(`[MenuService] Returning cached menu data (age: ${Math.round(cacheAge / 1000 / 60)} minutes)`);
        return cachedMenu.data;
      }
    }
    
    // Fetch fresh menu data from API
    console.log('[MenuService] Fetching fresh menu data from API');
    const menuData = await fetchMenuFromAPI();
    
    // Cache the new data
    const menuCache: MenuCache = {
      data: menuData,
      timestamp: Date.now(),
    };
    
    await AsyncStorage.setItem(MENU_CACHE_KEY, JSON.stringify(menuCache));
    console.log('[MenuService] Menu data cached successfully');
    
    return menuData;
  } catch (error) {
    console.error('[MenuService] Error fetching menu:', error);
    
    // Attempt to return stale cache as fallback
    try {
      const cachedMenuJson = await AsyncStorage.getItem(MENU_CACHE_KEY);
      if (cachedMenuJson) {
        const cachedMenu: MenuCache = JSON.parse(cachedMenuJson);
        console.warn('[MenuService] Returning stale cached data due to fetch error');
        return cachedMenu.data;
      }
    } catch (fallbackError) {
      console.error('[MenuService] Failed to retrieve fallback cache:', fallbackError);
    }
    
    // Return empty array if all else fails
    return [];
  }
};

/**
 * Fetches menu from the backend API
 * This is a placeholder implementation - adjust endpoint and headers as needed
 * @returns Promise<MenuItem[]> - Array of menu items from API
 */
const fetchMenuFromAPI = async (): Promise<MenuItem[]> => {
  try {
    const response = await fetch('https://api.your-restaurant.com/menu', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate the response structure
    if (!Array.isArray(data)) {
      throw new Error('Invalid menu data format');
    }
    
    return data as MenuItem[];
  } catch (error) {
    console.error('[MenuService] API fetch failed:', error);
    throw error;
  }
};

/**
 * Clears the menu cache manually
 * @returns Promise<void>
 */
export const clearMenuCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(MENU_CACHE_KEY);
    console.log('[MenuService] Menu cache cleared');
  } catch (error) {
    console.error('[MenuService] Error clearing menu cache:', error);
    throw error;
  }
};

/**
 * Force refresh menu by clearing cache and fetching fresh data
 * @returns Promise<MenuItem[]> - Fresh array of menu items
 */
export const refreshMenu = async (): Promise<MenuItem[]> => {
  try {
    await clearMenuCache();
    return await fetchMenu();
  } catch (error) {
    console.error('[MenuService] Error refreshing menu:', error);
    throw error;
  }
};

/**
 * Gets the age of the cached menu in milliseconds
 * @returns Promise<number | null> - Age of cache in ms, or null if no cache exists
 */
export const getCacheAge = async (): Promise<number | null> => {
  try {
    const cachedMenuJson = await AsyncStorage.getItem(MENU_CACHE_KEY);
    
    if (!cachedMenuJson) {
      return null;
    }
    
    const cachedMenu: MenuCache = JSON.parse(cachedMenuJson);
    return Date.now() - cachedMenu.timestamp;
  } catch (error) {
    console.error('[MenuService] Error getting cache age:', error);
    return null;
  }
};

/**
 * Checks if the current cache is still valid (less than 24 hours old)
 * @returns Promise<boolean> - True if cache is valid, false otherwise
 */
export const isCacheValid = async (): Promise<boolean> => {
  try {
    const cacheAge = await getCacheAge();
    
    if (cacheAge === null) {
      return false;
    }
    
    return cacheAge < CACHE_DURATION_MS;
  } catch (error) {
    console.error('[MenuService] Error checking cache validity:', error);
    return false;
  }
};

export default {
  fetchMenu,
  clearMenuCache,
  refreshMenu,
  getCacheAge,
  isCacheValid,
};
