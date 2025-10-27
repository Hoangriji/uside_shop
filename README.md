# 🛍️ Uside Shop - E-commerce Platform

> Modern React E-commerce Website với Firebase Backend và Cloudinary Image Management

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.9-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-orange.svg)](https://firebase.google.com/)

## 🚀 Features

### 🎨 **Modern UI/UX Design**
- **Neumorphic Dark Theme** với custom accent colors
- **Responsive Design** tối ưu cho mọi thiết bị
- **Product Cards** hiện đại với hover animations
- **Wishlist System** với localStorage persistence
- **Color Theme Picker** - 6 màu sắc tùy chỉnh

### 🛒 **E-commerce Functionality**
- **Product Catalog** với filtering và sorting
- **Product Detail Pages** đầy đủ thông tin
- **Wishlist Management** - thêm/xóa sản phẩm yêu thích
- **Shopping Cart** (coming soon)
- **User Authentication** với Firebase

### 🔧 **Technical Features**
- **React 19.1.1** với Hooks và Context
- **TypeScript** cho type safety
- **Vite** build tool siêu nhanh
- **Firebase Integration** cho backend
- **Cloudinary** cho image optimization
- **Zustand** state management
- **Font Awesome Icons**

## 📱 Pages & Navigation

- **🏠 Home Page** - Featured products & promotions
- **📦 Products Page** - Product catalog với filtering
- **❤️ Wishlist Page** - Sản phẩm yêu thích
- **ℹ️ About Page** - Thông tin công ty
- **📞 Contact Page** - Liên hệ support
- **👁️ Product Detail** - Chi tiết sản phẩm

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **CSS3** - Styling với CSS Variables

### Backend & Services
- **Firebase** - Authentication & Database
- **Cloudinary** - Image Management & Optimization

### State Management
- **Zustand** - Lightweight state management
- **localStorage** - Client-side persistence

### Developer Tools
- **ESLint** - Code linting
- **TypeScript Config** - Strict type checking

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd uside_shop
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```powershell
# PowerShell (Windows)
Copy-Item .env.example .env.local

# macOS / Linux (bash / zsh)
cp .env.example .env.local

# Add your API keys to .env.local
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:5173
```

## 📦 Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Customization

### Color Themes
Website hỗ trợ 6 color themes có thể thay đổi trực tiếp từ header:
- 🔵 Cyan Blue (default)
- 🔴 Red
- 🟢 Teal  
- 🔵 Blue
- 🟢 Green
- 🟡 Yellow

### Adding New Products
Sản phẩm được quản lý qua Firebase.

## 📂 Project Structure

```
uside_shop/
├── 📁 src/
│   ├── 📁 components/          # Reusable components
│   │   ├── Header/            # Navigation header
│   │   ├── ProductCard/       # Product display cards
│   │   └── SimpleProductCard/ # Simplified product cards
│   ├── 📁 pages/              # Page components
│   │   ├── HomePage/          # Landing page
│   │   ├── ProductsPage/      # Product catalog
│   │   ├── WishlistPage/      # Wishlist management
│   │   ├── ProductDetailPage/ # Product details
│   │   ├── AboutPage/         # About company
│   │   └── ContactPage/       # Contact form
│   ├── 📁 styles/             # Global styles
│   ├── 📁 hooks/              # Custom React hooks
│   ├── 📁 store/              # Zustand stores
│   └── 📁 types/              # TypeScript definitions
├── 📁 public/                 # Static assets
└── 📄 package.json           # Dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- 🌐 Website: [usideshop.studio](https://www.uside.studio)
- 📱 Discord: [Join our community](https://discord.gg/usideshop)

---

Made with ❤️ by UdeSide Team
