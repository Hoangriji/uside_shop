# 🎨 USide Shop - Style Guide

## 📋 Table of Contents
1. [CSS Naming Conventions](#css-naming-conventions)
2. [Comment Standards](#comment-standards)
3. [File Organization](#file-organization)
4. [Component Structure](#component-structure)

---

## 🏗️ CSS Naming Conventions

### BEM Methodology (Block Element Modifier)

We follow **strict BEM naming** for all CSS classes:

```css
.block
.block__element
.block__element--modifier
.block--modifier
```

### Naming Rules

1. **Use kebab-case** for all class names
2. **Double underscores `__`** for elements
3. **Double hyphens `--`** for modifiers
4. **Prefix components** with their name

### ✅ Good Examples

```css
/* Product Card Component */
.product-card                    /* Block */
.product-card__image             /* Element */
.product-card__title             /* Element */
.product-card__price             /* Element */
.product-card__price--sale       /* Element with modifier */
.product-card--featured          /* Block with modifier */

/* Homepage Sections */
.hero-section                    /* Block */
.hero-section__title             /* Element */
.hero-section__description       /* Element */

/* Dashboard */
.dashboard-app                   /* Block */
.dashboard-app__sidebar          /* Element */
.dashboard-app__content          /* Element */
```

### ❌ Bad Examples

```css
/* Generic names (causes conflicts) */
.card                    /* Too generic */
.title                   /* Too generic */
.page-header             /* Conflicts across pages */
.content                 /* Too generic */

/* Inconsistent naming */
.productCard             /* camelCase not allowed */
.Product-Card            /* PascalCase not allowed */
.product_card            /* Single underscore not BEM */
```

---

## 💬 Comment Standards

### Language: **English Only**

All comments must be in English for consistency and international collaboration.

### Comment Structure

```css
/* ========================================
   COMPONENT NAME
   Brief description of component purpose
   ======================================== */

/* Section Description */
.block {
  /* Inline explanation for complex property */
  property: value;
}
```

### ✅ Good Examples

```css
/* ========================================
   PRODUCT CARD - FLIP DESIGN
   Interactive card with 3D flip animation
   ======================================== */

/* Card container with 3D perspective */
.product-card-container {
  perspective: 1000px;
}

/* Front face of card */
.product-card__front {
  z-index: 2;
}
```

### ❌ Bad Examples

```css
/* Container với perspective cho hiệu ứng 3D */   ❌ Vietnamese
/* Flipper - phần tử xoay */                      ❌ Vietnamese
/* MẶT TRƯỚC - FRONT SIDE */                     ❌ Mixed language

/* .old-class { ... } */                          ❌ Commented code
```

---

## 📁 File Organization

### Component Structure

```
ComponentName/
├── ComponentName.tsx       # React component
├── ComponentName.css       # Styles (BEM naming)
└── index.ts               # Export barrel
```

### CSS File Structure

```css
/* ========================================
   COMPONENT NAME
   ======================================== */

/* 1. Layout & Structure */
.component { }
.component__element { }

/* 2. Typography */
.component__title { }
.component__text { }

/* 3. Interactive States */
.component:hover { }
.component--active { }

/* 4. Responsive Design */
@media (max-width: 768px) {
  .component { }
}
```

---

## 🧩 Component Naming Patterns

### Pages

```css
/* HomePage */
.home-page
.home-page__header
.home-page__hero
.home-page__section

/* ProductsPage */
.products-page
.products-page__header
.products-page__filters
.products-page__grid

/* DashboardPage */
.dashboard-page
.dashboard-page__sidebar
.dashboard-page__content
```

### Reusable Components

```css
/* Button */
.btn                      /* Base button */
.btn--primary             /* Primary variant */
.btn--secondary           /* Secondary variant */
.btn--disabled            /* Disabled state */

/* TechButton */
.tech-btn
.tech-btn__inner
.tech-btn__text
.tech-btn--primary
.tech-btn--secondary
```

### Product Components

```css
/* ProductCard */
.product-card
.product-card__image
.product-card__title
.product-card__description
.product-card__price
.product-card__price--sale
.product-card--featured

/* ProductCarousel */
.product-carousel
.product-carousel__container
.product-carousel__slide
.product-carousel__navigation
```

---

## 🎯 Refactoring Checklist

When refactoring existing code:

- [ ] Convert all class names to BEM
- [ ] Add component prefix to prevent conflicts
- [ ] Replace generic names (`.card` → `.product-card`)
- [ ] Translate Vietnamese comments to English
- [ ] Remove commented code
- [ ] Group related styles with section comments
- [ ] Update corresponding `.tsx` files
- [ ] Test all styled components

---

## 📊 Current Status

### Needs Refactoring (Priority)

1. **ProductCard.css** ⚠️
   - `.card-title` → `.product-card__title`
   - `.card-image` → `.product-card__image`
   - `.card-price` → `.product-card__price`

2. **Page Components** ⚠️
   - `.page-header` → `.{page-name}__header`
   - `.page-title` → `.{page-name}__title`

3. **Comments** ⚠️
   - Convert Vietnamese → English
   - Remove commented code

### Already Following Standards ✅

1. **Skeleton.css** 
   - Using proper BEM (`skeleton-card__icon`)
   
2. **DashboardApp.css**
   - Good component prefixing

---

## 🔍 Code Review Guidelines

### Before Committing

1. ✅ All new classes follow BEM
2. ✅ Comments are in English
3. ✅ No generic class names
4. ✅ Component prefix is consistent
5. ✅ No commented code
6. ✅ Responsive breakpoints organized

### Peer Review Checklist

- [ ] Class names are descriptive and follow BEM
- [ ] No naming conflicts with existing code
- [ ] Comments explain "why", not "what"
- [ ] Mobile-first approach for media queries
- [ ] CSS variables used for theming

---

## 📚 Resources

- [BEM Methodology](http://getbem.com/)
- [CSS Guidelines](https://cssguidelin.es/)
- [Naming Conventions](https://www.freecodecamp.org/news/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849/)

---

**Last Updated:** December 21, 2025  
**Version:** 1.0.0
