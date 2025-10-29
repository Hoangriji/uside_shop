/**
 * Firebase Data Import Script
 * Import products, categories, and config from JSON files to Firebase
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAUzNjE73wLYUi29iOKiLaCfsyvHWHKtmc",
  authDomain: "uside-shop.firebaseapp.com",
  projectId: "uside-shop",
  storageBucket: "uside-shop.firebasestorage.app",
  messagingSenderId: "983690216457",
  appId: "1:983690216457:web:b7167d0b270e5b172a24d8"
};

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
