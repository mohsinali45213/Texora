<div align="center">

# Texora Marketplace 🧵✨

> A full-stack multi-vendor Textile & Fabric Marketplace platform built with Next.js 14, TypeScript, NextAuth v5, MongoDB Atlas, and AI-powered fabric intelligence.

[![Live Demo](https://img.shields.io/badge/Live_Demo-texora--five.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://texora-five.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

</div>

---

## 🌐 Demo & Screenshots

🚀 **Live Demo:** [https://texora-five.vercel.app/](https://texora-five.vercel.app/)

| Homepage Showcase | Navigation & Search | Fabric Categories |
| :---: | :---: | :---: |
| ![Homepage](https://raw.githubusercontent.com/mohsinali45213/Texora/main/public/images/homepage.png) | ![Navbar](https://raw.githubusercontent.com/mohsinali45213/Texora/main/public/images/navbar.png) | ![Categories](https://raw.githubusercontent.com/mohsinali45213/Texora/main/public/images/categories.png) |

| Fabric Product Grid | Specifications & GSM | User & Supplier Onboarding |
| :---: | :---: | :---: |
| ![Product Grid](https://raw.githubusercontent.com/mohsinali45213/Texora/main/public/images/productcard.png) | ![Product Detail](https://raw.githubusercontent.com/mohsinali45213/Texora/main/public/images/productdetail.png) | ![Registration](https://raw.githubusercontent.com/mohsinali45213/Texora/main/public/images/registration.png) |

---

## ✨ Features

- 🧵 **Multi-Vendor Textile Catalog**: Browse fabrics organized by weave type, GSM weight, material composition, and price tiers (Cotton, Silk, Denim, Linen, Technical Textiles, Wool).
- 👔 **Supplier Management Suite**: Dedicated portal (`/supplier/dashboard`) for textile manufacturers to upload bulk inventory, manage batch orders, specify GSM weight, and track sales volume.
- 🛒 **Buyer Portal & Shopping Cart**: Comprehensive buyer experience (`/buyer`) with interactive search, cart management, sample requests, and order checkout workflows.
- 🤖 **AI-Powered Textile Intelligence**: Integrated AI fabric assistant leveraging Hugging Face & OpenRouter APIs for fabric Q&A, material comparisons, and recommendations.
- 🔐 **NextAuth v5 Authentication**: Secure email/password login, registration, buyer/supplier role separation, custom onboarding flow (`/onboarding`), and route middleware protection.
- 📊 **Real-Time Analytics & Dashboard**: Recharts-powered metrics for sales volume, order status tracking, and category distribution.

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Language:** Next.js 14 (App Router), React 18, TypeScript
- **Styling & UI Components:** Tailwind CSS, Shadcn UI / Radix UI Primitives, Lucide Icons, Framer Motion, Next-Themes
- **State Management & Forms:** React Hook Form, Zod schema validation, Redux / React Context

### Backend & Database
- **API & Server:** Next.js App Router API Routes (`/app/api`)
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** NextAuth.js v5 (Beta), `bcryptjs`, JWT session cookies
- **AI Integration:** Hugging Face Inference API, OpenRouter API
- **Media Storage:** Cloudinary SDK

### Deployment & Tools
- **Deployment Platform:** Vercel
- **Database Seeding:** TypeScript seed scripts (`scripts/seed.ts`)

---

## 📁 Folder Structure

```
Texora/
├── app/                        # Next.js App Router (pages, layouts, API routes)
│   ├── (auth)/                 # Login, Register, and Onboarding pages
│   ├── (buyer)/                # Buyer portal (products, cart, checkout, buyer dashboard)
│   ├── (supplier)/             # Supplier portal (supplier dashboard, products, orders)
│   ├── api/                    # RESTful API endpoints (products, cart, orders, AI services)
│   └── dashboard/              # Shared dashboard router
├── components/                 # Reusable UI components & navigation menus
├── constants/                  # Fabric taxonomy & specification constants
├── context/                    # React Context state providers
├── docs/                       # Technical documentation
├── hooks/                      # Custom React hooks
├── lib/                        # MongoDB connection & helper utilities
├── models/                     # Mongoose database schemas (User, Product, Order, Cart)
├── public/                     # Static branding assets & fabric textures
├── repositories/               # Data access repository layer
├── scripts/                    # Database seeding scripts (`seed.ts`)
├── services/                   # Business logic services
├── types/                      # TypeScript interfaces & type definitions
├── .env.example                # Environment variables template
├── auth.config.ts              # NextAuth configuration
├── middleware.ts               # Route protection middleware
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## ⚙️ Installation / Setup

Follow these steps to set up and run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/mohsinali45213/Texora.git
cd Texora
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root directory (refer to `.env.example`).

---

## 🔑 Environment Variables

Create a `.env.local` file in the root folder with the following credentials:

```env
# NextAuth Secret Configuration
AUTH_SECRET=your_nextauth_secret_key

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/texora?retryWrites=true&w=majority

# Hugging Face AI Token
HF_TOKEN=hf_your_huggingface_token

# OpenRouter AI Key
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_api_key

# Cloudinary Media Storage Configuration
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Optional Domain Configuration
NEXTAUTH_URL=http://localhost:3000
```

---

## 🚀 Running the Project

### Seed Database
Populate your database with sample textile products and categories:
```bash
npm run seed
```

### Start Development Server
```bash
npm run dev
```
*Access the application at `http://localhost:3000`.*

### Build for Production
```bash
npm run build
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET, POST` | `/api/products` | Fetch fabric catalog or list a new textile product |
| `GET` | `/api/products/[id]` | Get detailed fabric specifications and GSM metrics |
| `GET` | `/api/products/categories` | Get fabric category taxonomy |
| `GET, POST` | `/api/cart` | Buyer shopping cart operations |
| `GET, POST` | `/api/orders` | Place orders and track order statuses |
| `POST` | `/api/ai/chat` | AI Textile Advisor & recommendation assistant |
| `POST` | `/api/ai/compare` | AI Fabric Comparison (tensile strength, GSM, breathability) |
| `POST` | `/api/ai/qa` | Fabric Quality Assurance Q&A |
| `POST` | `/api/auth/[...nextauth]` | NextAuth authentication endpoints |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Repository (`git fork https://github.com/mohsinali45213/Texora.git`)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author & Contact

**Mohsin Ali**

- **GitHub:** [@mohsinali45213](https://github.com/mohsinali45213)
- **Live Demo:** [texora-five.vercel.app](https://texora-five.vercel.app/)