import type { Product } from '../types';

/**
 * Wishlist utility functions
 * Chỉ lưu Product IDs vào localStorage, không lưu cả object
 */

const WISHLIST_KEY = 'wishlist';

/**
 * Get wishlist IDs from localStorage
 */
export const getWishlistIds = (): string[] => {
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);
    if (!saved) return [];
    
    const parsed = JSON.parse(saved);
    
    // Handle migration from old format (array of objects) to new format (array of IDs)
    if (Array.isArray(parsed) && parsed.length > 0) {
      if (typeof parsed[0] === 'object' && parsed[0].id) {
        // Old format detected - migrate to new format
        const ids = parsed.map((item: { id: string | number }) => String(item.id));
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
        return ids;
      }
      // New format - already array of IDs
      return parsed.map(id => String(id));
    }
    
    return [];
  } catch (error) {
    console.error('Error reading wishlist:', error);
    return [];
  }
};

/**
 * Add product ID to wishlist
 */
export const addToWishlist = (productId: string | number): void => {
  const ids = getWishlistIds();
  const id = String(productId);
  
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
      detail: { productId: id, isWishlisted: true }
    }));
  }
};

/**
 * Remove product ID from wishlist
 */
export const removeFromWishlist = (productId: string | number): void => {
  const ids = getWishlistIds();
  const id = String(productId);
  const filtered = ids.filter(wishlistId => wishlistId !== id);
  
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
    detail: { productId: id, isWishlisted: false }
  }));
};

/**
 * Check if product is in wishlist
 */
export const isInWishlist = (productId: string | number): boolean => {
  const ids = getWishlistIds();
  return ids.includes(String(productId));
};

/**
 * Clear all wishlist
 */
export const clearWishlist = (): void => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
    detail: { cleared: true }
  }));
};

/**
 * Get wishlist count
 */
export const getWishlistCount = (): number => {
  return getWishlistIds().length;
};

/**
 * Get full product objects from wishlist IDs
 * Requires passing the full products array
 */
export const getWishlistProducts = (allProducts: Product[]): Product[] => {
  const ids = getWishlistIds();
  return allProducts.filter(product => ids.includes(String(product.id)));
};
