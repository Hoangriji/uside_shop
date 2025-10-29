# Firebase Data Import - Completed ✅

## 🎉 Import thành công!

### 📊 Dữ liệu đã import:
- ✅ **50 sản phẩm** (keyboards, mice, headsets, monitors, USB, digital products)
- ✅ **7 danh mục** (Bàn phím, Chuột, Tai nghe, Màn hình, USB, Tài liệu số, Gia dụng)
- ✅ **Site configuration** (thông tin website, contact, social)
- ✅ **Admin credentials** (username: admin, password: admin123)

## 🔥 Firebase Collections

### `/products` - 50 documents
Tất cả sản phẩm từ `data/products.json`:
- Logitech G Pro X Superlight
- Razer BlackWidow V3 Pro
- SteelSeries Arctis Pro Wireless
- ASUS ROG Swift PG279QM
- ... và 46 sản phẩm khác

### `/categories` - 7 documents
```
- keyboard (Bàn Phím)
- mouse (Chuột)  
- headset (Tai Nghe)
- monitor (Màn Hình)
- usb (USB & Phụ Kiện)
- digital (Tài Liệu Số)
- other (Gia Dụng)
```

### `/config/site`
Thông tin cấu hình website từ `data/config.json`

### `/admin/credentials`
```
username: admin
password: admin123
email: admin@uside.shop
role: admin
```

## 🚀 Cách sử dụng

### Import lại data (nếu cần):
```bash
npm run import-data
```

### Script sẽ:
1. Đọc tất cả JSON từ folder `../data/`
2. Import products với batch processing (500 docs/batch)
3. Import categories
4. Import site config
5. Setup admin credentials

## 📁 Source Data
Tất cả data được lấy từ:
```
d:\Uside_Shop\data\
├── products.json (50 sản phẩm)
├── categories.json (7 danh mục)
└── config.json (cấu hình site)
```

## ⚠️ Lưu ý
- Script sẽ **OVERWRITE** data hiện tại trong Firebase
- Tất cả sản phẩm sẽ có `updated_at` timestamp mới
- Admin password mặc định: `admin123` (nên đổi sau)

## ✅ Kiểm tra

### 1. Vào Firebase Console:
https://console.firebase.google.com/project/uside-shop/firestore

### 2. Kiểm tra collections:
- `products` → Should have 50 documents
- `categories` → Should have 7 documents  
- `config/site` → Should have site info
- `admin/credentials` → Should have admin login

### 3. Test trên website:
```
http://localhost:5173/
http://localhost:5173/products
http://localhost:5173/dashboard (login: admin/admin123)
```

## 🎨 Features của data

### Products bao gồm:
- ✅ Full product info (name, description, images, price)
- ✅ Specs & features chi tiết
- ✅ Category & subcategory
- ✅ Tags, brand, compatibility
- ✅ Stock status, ratings, reviews
- ✅ Featured flags
- ✅ Digital products với file_size

### Categories bao gồm:
- ✅ Icon Font Awesome
- ✅ Type (physical/digital)
- ✅ Description
- ✅ Subcategories

## 🔄 Re-import nếu cần

Nếu muốn reset database về trạng thái ban đầu:
```bash
npm run import-data
```

Script sẽ tự động:
- Clear old data
- Import fresh data từ JSON
- Setup lại admin credentials

---

**Data import completed at:** ${new Date().toISOString()}
**Total products:** 50
**Total categories:** 7
**Status:** ✅ Ready for production
