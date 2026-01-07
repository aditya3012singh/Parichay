# 🏠 Parichay - Urban Service Marketplace

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Node](https://img.shields.io/badge/Node-v18+-green)
![Next.js](https://img.shields.io/badge/Next.js-16.1-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Parichay is a full-stack urban service marketplace platform that connects service providers with customers. Built with modern technologies for scalability, performance, and user experience.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Architecture](#architecture)
- [Project Status](#project-status)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- 🔐 **User Authentication** - OTP-based signup/login with JWT tokens
- 🛠️ **Service Marketplace** - Browse and book services by category
- 📍 **Location-Based Search** - Find providers near you using Haversine distance calculation
- 👥 **Provider Profiles** - Rich provider profiles with ratings and availability slots
- 💳 **Wallet System** - Digital wallet with top-up and transaction history
- ⭐ **Review System** - Rate and review completed services
- 💬 **Messaging** - Real-time messaging between customers and providers
- 🔔 **Notifications** - Real-time notifications for booking updates
- 🎁 **Coupon System** - Discount coupons for bookings
- 📱 **Real-time Updates** - WebSocket support for live provider matching
- 📊 **Analytics Dashboard** - Earnings and job tracking for providers

### Security Features
- JWT token-based authentication
- Bcrypt password hashing
- Rate limiting on sensitive endpoints
- Input validation with Zod schemas
- CORS protection
- Request size limits
- Error handling middleware

### Performance Features
- Pagination on all list endpoints
- Request/response caching with Redis
- Optimized database queries
- Real-time communication via Socket.io

---

## 🛠️ Tech Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Express.js | 5.1.0 |
| **ORM** | Prisma | 6.11.1 |
| **Database** | PostgreSQL | 15+ |
| **Caching** | Redis | (ioredis 5.3.2) |
| **Real-time** | Socket.io | 4.8.1 |
| **Authentication** | JWT + Bcryptjs | - |
| **File Upload** | Multer | 2.0.1 |
| **Validation** | Zod | 4.3.5 |
| **Email** | Nodemailer | 7.0.12 |
| **Rate Limiting** | express-rate-limit | - |
| **Logging** | Morgan | - |
| **Documentation** | Swagger/OpenAPI | - |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Next.js | 16.1.1 |
| **Build Tool** | Vite | Latest |
| **State Management** | Redux Toolkit | 2.11.2 |
| **HTTP Client** | Axios | - |
| **Styling** | Tailwind CSS | 4 |
| **UI Components** | React | 19 |
| **Real-time** | Socket.io Client | - |
| **Maps** | Leaflet | - |
| **Language** | TypeScript | - |

---

## 📁 Project Structure

```
Parichay/
├── backend/                          # Express.js backend
│   ├── src/
│   │   ├── index.js                 # Server entry point
│   │   ├── controllers/             # Request handlers (12 files)
│   │   │   ├── auth.controller.js
│   │   │   ├── booking.controller.js
│   │   │   ├── provider.controller.js
│   │   │   ├── wallet.controller.js
│   │   │   ├── review.controller.js
│   │   │   ├── message.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── availability.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── coupon.controller.js
│   │   │   ├── file.controller.js
│   │   │   └── match.controller.js
│   │   ├── services/                # Business logic (12 files)
│   │   │   ├── auth.service.js
│   │   │   ├── booking.service.js
│   │   │   ├── provider.service.js
│   │   │   ├── wallet.service.js
│   │   │   ├── review.service.js
│   │   │   ├── message.service.js
│   │   │   ├── notification.service.js
│   │   │   ├── availability.service.js
│   │   │   ├── category.service.js
│   │   │   ├── coupon.service.js
│   │   │   ├── file.service.js
│   │   │   └── match.service.js
│   │   ├── routes/                  # API routes (12 files)
│   │   │   ├── auth.route.js
│   │   │   ├── booking.route.js
│   │   │   ├── provider.route.js
│   │   │   ├── wallet.route.js
│   │   │   ├── review.route.js
│   │   │   ├── message.route.js
│   │   │   ├── notification.route.js
│   │   │   ├── availability.route.js
│   │   │   ├── category.route.js
│   │   │   ├── coupon.route.js
│   │   │   ├── file.route.js
│   │   │   └── match.route.js
│   │   ├── middlewares/             # Middleware functions
│   │   │   ├── authMiddleware.js
│   │   │   ├── isAdmin.js
│   │   │   ├── s3upload.js
│   │   │   └── errorHandler.js
│   │   ├── socket/
│   │   │   └── matchHandler.js      # WebSocket event handlers
│   │   ├── validators/
│   │   │   └── ValidateUser.js      # Zod validation schemas
│   │   ├── controllers/
│   │   │   └── geoHelpers.js        # Haversine distance calc
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   ├── seed.js                  # Database seeding
│   │   └── migrations/              # Database migrations
│   ├── uploads/                     # User uploaded files
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── package.json
│   └── README.md                    # Backend README
│
├── project/                         # React/Vite frontend
│   ├── src/
│   │   ├── main.tsx                # App entry point
│   │   ├── App.tsx                 # Root component
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── Auth/               # Auth components
│   │   │   ├── Booking/            # Booking components
│   │   │   ├── Bookings/           # Bookings list
│   │   │   ├── Dashboard/          # User dashboard
│   │   │   ├── Home/               # Landing page
│   │   │   ├── Messages/           # Messaging
│   │   │   ├── Payments/           # Payment dashboard
│   │   │   ├── ProviderPanel/      # Provider dashboard
│   │   │   ├── Reviews/            # Reviews
│   │   │   ├── Services/           # Service browsing
│   │   │   ├── Settings/           # Settings
│   │   │   └── Layout/             # Layout components
│   │   ├── store/                  # Redux state management
│   │   │   ├── index.js            # Store config
│   │   │   ├── provider.js         # Redux provider
│   │   │   ├── hooks.js            # Custom hooks
│   │   │   └── api/                # Async thunks
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   └── api.ts              # HTTP client
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   ├── utils/
│   │   │   └── navigation.ts
│   │   ├── index.css
│   │   └── vite-env.d.ts
│   ├── public/                     # Static assets
│   ├── vite.config.ts              # Vite config
│   ├── tsconfig.json               # TypeScript config
│   ├── tailwind.config.js          # Tailwind config
│   ├── package.json
│   └── README.md                   # Frontend README
│
├── README.md                       # This file
└── .gitignore

```

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **PostgreSQL** 15 or higher
- **Redis** (optional, for caching)
- **Git** for version control

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/aditya3012singh/Parichay.git
cd Parichay
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../project
npm install
```

### 4. Set Up Database

```bash
cd ../backend

# Create PostgreSQL database
createdb parichay

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database with sample data
npx prisma db seed
```

---

## 🔐 Environment Setup

### Backend Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Server
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/parichay"

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@parichay.com

# Redis
REDIS_URL=redis://localhost:6379

# File Upload
MAX_FILE_SIZE=50mb
UPLOAD_DIR=./uploads

# Frontend URL
FRONTEND_URL=http://localhost:3000

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=us-east-1
```

### Frontend Environment Variables

Create `.env.local` file in `project/` directory:

```bash
VITE_API_URL=http://localhost:8080/api/v1
VITE_SOCKET_URL=http://localhost:8080
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:8080
```

**Terminal 2 - Frontend:**
```bash
cd project
npm run dev
# App runs on http://localhost:5173 (or next available port)
```

### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd project
npm run build
npm start
```

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Check code quality

**Frontend:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm run type-check` - Check TypeScript types

---

## 📚 API Documentation

### Access Swagger Documentation

Once backend is running:
```
http://localhost:8080/api-docs
```

### Base URL
```
http://localhost:8080/api/v1
```

### Main API Routes

| Feature | Endpoint | Method |
|---------|----------|--------|
| **Authentication** | `/auth/signup` | POST |
| | `/auth/signin` | POST |
| | `/auth/generate-otp` | POST |
| | `/auth/verify-otp` | POST |
| **Bookings** | `/booking/create` | POST |
| | `/booking/my-bookings` | GET |
| | `/booking/my-jobs` | GET |
| | `/booking/:id/status` | PUT |
| **Providers** | `/provider/profile` | POST |
| | `/provider/profile` | GET |
| | `/provider/profile` | PUT |
| | `/provider/search` | GET |
| | `/provider/nearby` | GET |
| **Wallet** | `/wallet/balance` | GET |
| | `/wallet/transactions` | GET |
| | `/wallet/topup` | POST |
| **Reviews** | `/reviews/create` | POST |
| | `/reviews/provider/:id` | GET |
| **Messages** | `/messages/send` | POST |
| | `/messages/conversation/:id` | GET |
| **Notifications** | `/notifications` | GET |
| | `/notifications/:id/read` | PUT |
| **Services** | `/categories` | GET |
| **Availability** | `/availability/slots` | POST |
| **Coupons** | `/coupons/validate` | POST |

For detailed API documentation, refer to [backend/README.md](backend/README.md) and [IMPLEMENTATION_GUIDE.md](backend/IMPLEMENTATION_GUIDE.md).

---

## 🗄️ Database

### Database Schema

**Core Models (12 total):**

1. **User** - User accounts (customers, providers, admins)
2. **ProviderProfile** - Provider details, ratings, availability
3. **Booking** - Service bookings with status tracking
4. **Wallet** - User wallet balance management
5. **WalletTransaction** - Transaction history
6. **ServiceCategory** - Service categories (plumbing, electrical, etc.)
7. **Review** - Service reviews and ratings
8. **Message** - User-to-provider messaging
9. **Notification** - User notifications
10. **File** - Uploaded documents and images
11. **AvailabilitySlot** - Provider availability slots
12. **Coupon** - Discount coupons

### Database Diagrams & Details

See [backend/README.md](backend/README.md#database-schema) for complete schema documentation.

### Migrations

```bash
# View migration status
npx prisma migrate status

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma migrate reset
```

---

## 🏗️ Architecture

### 3-Layer Backend Architecture

```
Routes (API Endpoints)
    ↓
Controllers (Request Handler)
    ↓
Services (Business Logic)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

### Frontend Architecture

```
React Components
    ↓
Redux State Management
    ↓
Axios HTTP Client
    ↓
Backend API
```

### Real-time Communication

```
Frontend (Socket.io Client)
    ↔️
Backend (Socket.io Server)
    ↓
Provider Matching
```

---

## 📊 Project Status

### Backend Health: 70/100

**✅ Completed:**
- Core 3-layer architecture
- 12 services with controllers and routes
- JWT authentication with OTP
- Wallet system with transactions
- Provider location matching
- Real-time socket communication
- Error handling middleware
- Request validation with Zod

**⚠️ In Progress / Todo:**

| Priority | Issues | Time | Status |
|----------|--------|------|--------|
| 🔴 Critical | Input validation on all endpoints | 2h | Pending |
| 🔴 Critical | Rate limiting | 30min | Pending |
| 🔴 Critical | Request size limits | 10min | Pending |
| 🟠 High | Pagination on list endpoints | 1.5h | Pending |
| 🟠 High | Search/filter capabilities | 1h | Pending |
| 🟠 High | Refund logic | 30min | Pending |
| 🟠 High | Request logging (Morgan) | 20min | Pending |
| 🟡 Medium | API documentation (Swagger) | 45min | Pending |
| 🟡 Medium | Transaction handling | 1h | Pending |
| 🟡 Medium | Booking lifecycle validation | 30min | Pending |
| 🟢 Low | Password reset flow | 30min | Pending |
| 🟢 Low | Multiple provider profiles | 15min | Pending |

**Estimated Time to Production (95/100): ~10 hours**

See [backend/IMPLEMENTATION_GUIDE.md](backend/IMPLEMENTATION_GUIDE.md) for implementation details.

### Frontend Health: 80/100

**✅ Completed:**
- Redux Toolkit state management (6 slices)
- Async thunks with axios (6 API integrations)
- Centralized axios client with auto headers
- Protected routes
- All main components and layouts
- Real-time socket integration
- Mobile-responsive design

**⚠️ In Progress:**
- Error boundaries
- Loading states optimization
- Offline support
- PWA features

---

## 🚢 Deployment

### Backend Deployment

**Using Railway/Render/Heroku:**

1. Set environment variables
2. Connect repository
3. Configure PostgreSQL
4. Deploy

**Production checklist:**
- [ ] Set `NODE_ENV=production`
- [ ] Configure database with production credentials
- [ ] Set strong JWT secret
- [ ] Configure email service
- [ ] Set up Redis (optional but recommended)
- [ ] Configure CORS for production frontend
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy

### Frontend Deployment

**Using Vercel/Netlify:**

1. Connect repository
2. Set `VITE_API_URL` to production backend URL
3. Deploy

**Production checklist:**
- [ ] Set correct API URL
- [ ] Enable analytics
- [ ] Configure CDN
- [ ] Set up error tracking
- [ ] Test all features with production backend

---

## 👥 Contributing

### Development Workflow

1. Create feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and test locally
   ```bash
   npm run dev  # Run tests in development
   npm run lint # Check code quality
   ```

3. Commit with meaningful messages
   ```bash
   git commit -m "feat: add new feature description"
   ```

4. Push to repository
   ```bash
   git push origin feature/your-feature-name
   ```

5. Open pull request on GitHub

### Code Style

- Use consistent naming conventions
- Add comments for complex logic
- Write tests for new features
- Follow ESLint rules (run `npm run lint`)
- Use TypeScript for frontend code

### Commit Message Format

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Example: `feat: add provider search filters`

---

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Kill process on port 8080
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

#### Database connection error
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check DATABASE_URL in .env
# Format: postgresql://user:password@localhost:5432/parichay

# Reset database (development only)
cd backend
npx prisma migrate reset
```

#### Frontend API calls failing
```bash
# Check backend is running on correct port
curl http://localhost:8080/api/v1/health

# Verify VITE_API_URL in .env.local
# Should match backend URL
```

#### Socket.io connection issues
```bash
# Check browser console for errors
# Verify VITE_SOCKET_URL matches backend URL
# Check CORS_ORIGIN in backend .env
```

#### Node modules issues
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install

# Or use npm ci for exact versions
npm ci
```

### Getting Help

- Check the [backend README](backend/README.md)
- Review [IMPLEMENTATION_GUIDE.md](backend/IMPLEMENTATION_GUIDE.md) for known issues
- Check GitHub issues
- Contact development team

---

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@parichay.com
- Discord: [Join our community]

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Team

- **Lead Developer**: Aditya Singh
- **Contributors**: [Add contributors here]

---

## 📈 Roadmap

### Q1 2026
- [ ] Implement all Phase 1 security fixes
- [ ] Add pagination and search
- [ ] Deploy to production
- [ ] Beta testing with real users

### Q2 2026
- [ ] Add admin dashboard
- [ ] Implement subscription plans
- [ ] Add more service categories
- [ ] Mobile app (React Native)

### Q3 2026
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Recommendation system
- [ ] Affiliate program

---

## 🙏 Acknowledgments

- Express.js community
- Prisma team
- Next.js team
- All contributors and testers

---

**Last Updated:** January 7, 2026  
**Status:** 🟡 In Development  
**Maintainer:** Aditya Singh

---

<!-- <div align="center">

Built with ❤️ for urban service seekers and providers

[Website](https://parichay.com) • [Documentation](./backend/README.md) • [Issues](https://github.com/aditya3012singh/Parichay/issues)

</div> -->
