import { create } from 'zustand';
import type { Product, SearchFilters } from '../types';

interface ProductStore {
  // State
  products: Product[];
  filteredProducts: Product[];
  filters: SearchFilters;
  searchQuery: string;
  loading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setFilters: (filters: SearchFilters) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  
  // Computed
  getFeaturedProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  getDigitalProducts: () => Product[];
  getPhysicalProducts: () => Product[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  filteredProducts: [],
  filters: {},
  searchQuery: '',
  loading: false,
  error: null,

  // Actions
  setProducts: (products) => {
    set({ products, filteredProducts: products });
    get().applyFilters();
  },

  setFilters: (filters) => {
    set({ filters });
    get().applyFilters();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  clearFilters: () => {
    set({ filters: {}, searchQuery: '' });
    get().applyFilters();
  },

  applyFilters: () => {
    const { products, filters, searchQuery } = get();
    let filtered = [...products];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Apply subcategory filter
    if (filters.subcategory) {
      filtered = filtered.filter(product => product.subcategory === filters.subcategory);
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(product => product.type === filters.type);
    }

    // Apply free filter
    if (filters.isFree !== undefined) {
      filtered = filtered.filter(product => 
        filters.isFree ? product.is_free === true : product.is_free !== true
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        const price = product.price_vnd;
        return price >= (filters.priceRange?.min || 0) && 
               price <= (filters.priceRange?.max || Infinity);
      });
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(product =>
        filters.tags!.some(tag => product.tags.includes(tag))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price_low':
            return a.price_vnd - b.price_vnd;
          case 'price_high':
            return b.price_vnd - a.price_vnd;
          default:
            return 0;
        }
      });
    }

    set({ filteredProducts: filtered });
  },

  // Computed getters
  getFeaturedProducts: () => {
    return get().products.filter(product => product.featured);
  },

  getProductsByCategory: (category) => {
    return get().products.filter(product => product.category === category);
  },

  getDigitalProducts: () => {
    return get().products.filter(product => product.type === 'digital');
  },

  getPhysicalProducts: () => {
    return get().products.filter(product => product.type === 'physical');
  },
}));