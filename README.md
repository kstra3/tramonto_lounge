# 🌅 Tramonto Lounge - Sunset Bar Restaurant, Santorini

A production-ready, SEO-optimized website for Tramonto Lounge, a sunset bar restaurant in Santorini, Greece.

## 📁 Project Structure

```
Santorini_restaurant_website/
├── index.html          # Main landing page
├── menu.html           # Dedicated menu page
├── styles.css          # Main stylesheet (Santorini blue & sunset palette)
├── responsive.css      # Responsive breakpoints (320px to 4K)
├── main.js             # Navigation, lightbox, cookies, parallax
├── animations.js       # Intersection Observer scroll animations
├── sitemap.xml         # XML sitemap for SEO
├── robots.txt          # Search engine crawl directives
├── DSC*.JPG            # Sunset & caldera photography
├── WhatsApp*.jpeg      # Dish photography
└── README.md           # This file
```

## 🚀 Setup & Deployment

### Local Development
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using VS Code
# Install "Live Server" extension → Right-click index.html → Open with Live Server
```

### Production Deployment
1. Upload all files to your web hosting provider
2. Update the canonical URLs in both HTML files to your actual domain
3. Update the Google Maps embed with your exact restaurant coordinates
4. Update phone number, email, and address with real info
5. Ensure HTTPS is enabled on your domain

## 🎨 Design Features
- **Santorini Vibes**: Aegean blue + sunset orange dual palette
- **Flamingo Naxos-inspired**: Clean, story-driven, smooth scroll layout
- **Responsive**: Mobile-first, works from 320px phones to 4K displays
- **Animations**: Fade-in on scroll, parallax hero, stagger effects
- **Lightbox Gallery**: Click-to-zoom gallery with keyboard navigation
- **Accessibility**: ARIA labels, keyboard nav, reduced-motion support

## 🔍 SEO Features
- JSON-LD Schema (Restaurant, Menu, BreadcrumbList)
- Open Graph & Twitter Card meta tags
- Semantic HTML5 with proper heading hierarchy
- Alt text on all images
- Lazy loading for performance
- XML sitemap & robots.txt
- Local SEO: NAP consistency, Google Maps embed

## 📱 Social Media
- Instagram: [@tramonto_sunsetview](https://www.instagram.com/tramonto_sunsetview/)

## ✏️ Customization
- **Colors**: Edit CSS variables in `:root` block of `styles.css`
- **Content**: Edit text directly in HTML files
- **Images**: Replace JPG/JPEG files with your own photos
- **Map**: Update the Google Maps iframe `src` with your coordinates
- **Contact**: Update phone/email in both HTML files and JSON-LD schema

## 📋 License
© 2026 Tramonto Lounge. All rights reserved.
