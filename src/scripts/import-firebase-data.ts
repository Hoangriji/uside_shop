/**
 * Firebase Data Import Script
 * Import products, categories, and config from JSON files to Firebase
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// SECURITY: Use environment variables - NEVER hardcode API keys!
// Create a .env file in project root with your Firebase credentials
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Firebase configuration missing! Please set VITE_FIREBASE_* environment variables.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Read JSON files
const dataDir = path.join(process.cwd(), '..', 'data');
const productsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf-8'));
const categoriesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf-8'));
const configData = JSON.parse(fs.readFileSync(path.join(dataDir, 'config.json'), 'utf-8'));

async function importProducts() {
  console.log('🔄 Importing products to Firebase...');
  
  const products = productsData.products;
  const batchSize = 500; // Firestore limit
  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (const product of products) {
    const productRef = doc(collection(db, 'products'), product.id);
    batch.set(productRef, {
      ...product,
      updated_at: new Date().toISOString()
    });
    
    count++;
    batchCount++;

    // Commit batch every 500 documents
    if (batchCount === batchSize) {
      await batch.commit();
      console.log(`  ✅ Committed batch of ${batchSize} products`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  // Commit remaining documents
  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Committed final batch of ${batchCount} products`);
  }

  console.log(`✅ Successfully imported ${count} products!\n`);
}

async function importCategories() {
  console.log('🔄 Importing categories to Firebase...');
  
  const categories = categoriesData.categories;
  const batch = writeBatch(db);

  for (const category of categories) {
    const categoryRef = doc(collection(db, 'categories'), category.id);
    batch.set(categoryRef, {
      ...category,
      updated_at: new Date().toISOString()
    });
  }

  await batch.commit();
  console.log(`✅ Successfully imported ${categories.length} categories!\n`);
}

async function importConfig() {
  console.log('🔄 Importing site configuration to Firebase...');
  
  const configRef = doc(db, 'config', 'site');
  await setDoc(configRef, {
    ...configData,
    updated_at: new Date().toISOString()
  });

  console.log('✅ Successfully imported site configuration!\n');
}

async function importAdminCredentials() {
  console.log('🔄 Setting up admin credentials...');
  
  const adminRef = doc(db, 'admin', 'credentials');
  await setDoc(adminRef, {
    username: 'admin',
    password: 'admin123',
    email: 'admin@uside.shop',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLogin: null
  });

  console.log('✅ Admin credentials set (username: admin, password: admin123)\n');
}

async function main() {
  try {
    console.log('🚀 Starting Firebase data import...\n');
    console.log('📁 Data directory:', dataDir);
    console.log(`📦 Products to import: ${productsData.products.length}`);
    console.log(`📂 Categories to import: ${categoriesData.categories.length}`);
    console.log('');

    // Import all data
    await importCategories();
    await importProducts();
    await importConfig();
    await importAdminCredentials();

    console.log('🎉 All data imported successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`  - Products: ${productsData.products.length}`);
    console.log(`  - Categories: ${categoriesData.categories.length}`);
    console.log(`  - Site Config: ✅`);
    console.log(`  - Admin Credentials: ✅`);
    console.log('');
    console.log('✨ Your Firebase database is ready!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

main();
