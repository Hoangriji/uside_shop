import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Product } from '../types';
import { ActivityLogsService } from './activityLogsService';

// Products Service
export class ProductsService {
  private static collection = collection(db, 'products');

  // Get all products with real-time updates
  static subscribeToProducts(callback: (products: Product[]) => void) {
    const q = query(this.collection, orderBy('created_at', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      callback(products);
    });
  }

  // Get products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    const q = query(this.collection, where('category', '==', category));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  }

  // Get featured products
  static async getFeaturedProducts(): Promise<Product[]> {
    const q = query(this.collection, where('featured', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  }

  // Get single product
  static async getProduct(id: string): Promise<Product | null> {
    const docRef = doc(this.collection, id);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as Product;
    }
    
    return null;
  }

  // Create product
  static async createProduct(product: Omit<Product, 'id'>): Promise<string> {
    const docRef = await addDoc(this.collection, {
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Log activity
    await ActivityLogsService.addLog({
      action: 'create',
      productId: docRef.id,
      productName: product.name,
      timestamp: new Date().toISOString(),
      category: product.category,
      details: `Đã thêm sản phẩm mới`
    });
    
    return docRef.id;
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const docRef = doc(this.collection, id);
    
    // Get product name for logging
    const productDoc = await getDoc(docRef);
    const productName = productDoc.exists() ? (productDoc.data() as Product).name : 'Unknown';
    
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString()
    });
    
    // Log activity
    await ActivityLogsService.addLog({
      action: 'update',
      productId: id,
      productName,
      timestamp: new Date().toISOString(),
      details: `Đã cập nhật sản phẩm`
    });
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    const docRef = doc(this.collection, id);
    
    // Get product info before deletion
    const productDoc = await getDoc(docRef);
    const productName = productDoc.exists() ? (productDoc.data() as Product).name : 'Unknown';
    const category = productDoc.exists() ? (productDoc.data() as Product).category : undefined;
    
    await deleteDoc(docRef);
    
    // Log activity
    await ActivityLogsService.addLog({
      action: 'delete',
      productId: id,
      productName,
      timestamp: new Date().toISOString(),
      category,
      details: `Đã xóa sản phẩm`
    });
  }

  // Upload product images
  static async uploadImages(files: File[], productId: string): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `products/${productId}/image_${index}_${Date.now()}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    });

    return await Promise.all(uploadPromises);
  }

  // Delete product images
  static async deleteImages(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(async (url) => {
      try {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('Failed to delete image:', url, error);
      }
    });

    await Promise.all(deletePromises);
  }
}

// Categories Service
export class CategoriesService {
  private static collection = collection(db, 'categories');

  // Get all categories
  static async getCategories() {
    const snapshot = await getDocs(this.collection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || '',
      description: doc.data().description || '',
      icon: doc.data().icon || '',
      type: doc.data().type || 'physical',
      subcategories: doc.data().subcategories || [],
      ...doc.data()
    }));
  }

  // Subscribe to categories changes
  static subscribeToCategories(callback: (categories: Array<Record<string, unknown>>) => void) {
    return onSnapshot(this.collection, (snapshot) => {
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        description: doc.data().description || '',
        icon: doc.data().icon || '',
        type: doc.data().type || 'physical',
        subcategories: doc.data().subcategories || [],
        ...doc.data()
      }));
      
      callback(categories);
    });
  }
}

// Featured Products Configuration Service
export class FeaturedService {
  private static docRef = doc(db, 'config', 'featured');

  // Get featured configuration
  static async getFeaturedConfig() {
    const snapshot = await getDoc(this.docRef);
    
    if (snapshot.exists()) {
      return snapshot.data();
    }
    
    return {
      featuredProducts: [],
      freeDigitalProducts: []
    };
  }

  // Update featured products
  static async updateFeaturedProducts(productIds: string[]): Promise<void> {
    // Get current featured products to determine changes
    const currentConfig = await this.getFeaturedConfig();
    const currentFeatured = currentConfig.featuredProducts || [];
    
    await updateDoc(this.docRef, {
      featuredProducts: productIds,
      updatedAt: new Date().toISOString()
    });

    // Update featured flag on products
    const productsCollection = collection(db, 'products');
    const allProductsSnapshot = await getDocs(productsCollection);
    
    const updatePromises = allProductsSnapshot.docs.map(async (productDoc) => {
      const productData = productDoc.data() as Product;
      const isNowFeatured = productIds.includes(productDoc.id);
      const wasFeatured = currentFeatured.includes(productDoc.id);
      
      await updateDoc(doc(productsCollection, productDoc.id), {
        featured: isNowFeatured
      });
      
      // Log activity for featured/unfeatured changes
      if (isNowFeatured && !wasFeatured) {
        await ActivityLogsService.addLog({
          action: 'feature',
          productId: productDoc.id,
          productName: productData.name,
          timestamp: new Date().toISOString(),
          category: productData.category,
          details: `Đã đặt làm sản phẩm nổi bật`
        });
      } else if (!isNowFeatured && wasFeatured) {
        await ActivityLogsService.addLog({
          action: 'unfeature',
          productId: productDoc.id,
          productName: productData.name,
          timestamp: new Date().toISOString(),
          category: productData.category,
          details: `Đã bỏ khỏi danh sách nổi bật`
        });
      }
    });

    await Promise.all(updatePromises);
  }

  // Update free digital products
  static async updateFreeDigitalProducts(productIds: string[]): Promise<void> {
    await updateDoc(this.docRef, {
      freeDigitalProducts: productIds,
      updatedAt: new Date().toISOString()
    });

    // Update is_free flag on digital products
    const productsCollection = collection(db, 'products');
    const digitalProductsQuery = query(
      productsCollection, 
      where('type', '==', 'digital')
    );
    const digitalProductsSnapshot = await getDocs(digitalProductsQuery);
    
    const updatePromises = digitalProductsSnapshot.docs.map(async (productDoc) => {
      const isNowFree = productIds.includes(productDoc.id);
      await updateDoc(doc(productsCollection, productDoc.id), {
        is_free: isNowFree
      });
    });

    await Promise.all(updatePromises);
  }

  // Subscribe to featured config changes
  static subscribeToFeaturedConfig(callback: (config: {featuredProducts: string[]; freeDigitalProducts: string[]; updatedAt?: string}) => void) {
    return onSnapshot(this.docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback({
          featuredProducts: data.featuredProducts || [],
          freeDigitalProducts: data.freeDigitalProducts || [],
          updatedAt: data.updatedAt
        });
      } else {
        callback({
          featuredProducts: [],
          freeDigitalProducts: []
        });
      }
    });
  }
}

// Admin Authentication Service
export class AdminAuthService {
  private static docRef = doc(db, 'admin', 'credentials');

  // Validate admin credentials
  static async validateCredentials(username: string, password: string): Promise<boolean> {
    try {
      // Temporary hardcoded credentials for development
      const defaultUsername = 'admin';
      const defaultPassword = 'admin123';
      
      // Check hardcoded credentials first
      if (username === defaultUsername && password === defaultPassword) {
        return true;
      }
      
      // Then check Firebase if needed
      const snapshot = await getDoc(this.docRef);
      
      if (snapshot.exists()) {
        const adminData = snapshot.data();
        return adminData.username === username && adminData.password === password;
      }
      
      return false;
    } catch (error) {
      console.error('Error validating credentials:', error);
      // Fallback to hardcoded credentials if Firebase fails
      return username === 'admin' && password === 'admin123';
    }
  }

  // Update admin credentials
  static async updateCredentials(newCredentials: {
    username?: string;
    password?: string;
    email?: string;
  }): Promise<void> {
    await updateDoc(this.docRef, {
      ...newCredentials,
      updatedAt: new Date().toISOString()
    });
  }

  // Update last login
  static async updateLastLogin(): Promise<void> {
    await updateDoc(this.docRef, {
      lastLogin: new Date().toISOString()
    });
  }
}

// Site Configuration Service
export class SiteConfigService {
  private static docRef = doc(db, 'config', 'site');

  // Get site configuration
  static async getSiteConfig() {
    try {
      const snapshot = await getDoc(this.docRef);
      
      if (snapshot.exists()) {
        return snapshot.data();
      }
      
      // Return default config if not exists
      return {
        site: {
          name: 'Uside Shop',
          tagline: 'Gaming & Digital Store',
          description: 'Your one-stop shop for gaming peripherals and digital products',
          currency: {
            primary: 'VNĐ',
            virtual: 'UPoints'
          }
        },
        contact: {
          email: 'contact@uside.shop',
          phone: '+84 123 456 789',
          address: 'Vietnam'
        },
        social: {
          facebook: '',
          instagram: '',
          twitter: '',
          youtube: ''
        }
      };
    } catch (error) {
      console.error('Error getting site config:', error);
      throw error;
    }
  }

  // Subscribe to site config changes
  static subscribeToSiteConfig(callback: (config: Record<string, unknown>) => void) {
    return onSnapshot(this.docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      } else {
        // Return default config
        callback({
          site: {
            name: 'Uside Shop',
            tagline: 'Gaming & Digital Store',
            description: 'Your one-stop shop for gaming peripherals and digital products',
            currency: {
              primary: 'VNĐ',
              virtual: 'UPoints'
            }
          },
          contact: {
            email: 'contact@uside.shop',
            phone: '+84 123 456 789',
            address: 'Vietnam'
          },
          social: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: ''
          }
        });
      }
    });
  }

  // Update site configuration
  static async updateSiteConfig(config: Record<string, unknown>): Promise<void> {
    await updateDoc(this.docRef, {
      ...config,
      updatedAt: new Date().toISOString()
    });
  }
}