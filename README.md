# 🏠 Parichay - Urban Service Marketplace

A full-stack platform connecting service providers with customers. Browse services, book appointments, manage payments, and track in real-time.

**Status:** 🟡 In Development | **Backend:** 70/100 | **Frontend:** 80/100

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL 15+
- Redis (optional)

### Installation

```bash
# Clone and setup
git clone https://github.com/aditya3012singh/Parichay.git
cd Parichay

# Backend setup
cd backend
npm install
# Configure .env file
npm run dev

# Frontend setup (new terminal)
cd project
npm install
npm run dev
```

---

## 📁 Project Structure

### Backend (`/backend`)
Express.js REST API with 3-layer architecture

```
src/
├── services/          # Business logic (12 files)
│   ├── auth.service.js
│   ├── booking.service.js
│   ├── provider.service.js
│   ├── wallet.service.js
│   └── ... (8 more)
├── controllers/       # Request handlers (12 files)
│   ├── auth.controller.js
│   ├── booking.controller.js
│   └── ... (10 more)
├── routes/           # API endpoints (12 files)
│   ├── auth.route.js
│   ├── booking.route.js
│   └── ... (10 more)
├── middlewares/      # Auth, error handling, uploads
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── s3upload.js
├── validators/       # Zod validation schemas
├── socket/          # WebSocket handlers
└── controllers/     # Helpers (geo, etc.)

prisma/
├── schema.prisma    # Database models (12 total)
├── seed.js
└── migrations/      # Database migrations
```

**12 Core Services:**
- 🔐 Authentication (OTP, JWT, signup/login)
- 📅 Bookings (create, track, cancel)
- 👤 Provider Profiles (ratings, availability)
- 💰 Wallet (balance, transactions, topup)
- ⭐ Reviews (ratings & feedback)
- 💬 Messages (user-to-provider chat)
- 🔔 Notifications (booking updates)
- 🛠️ Categories (service categories)
- ⏰ Availability (provider time slots)
- 🎁 Coupons (discount codes)
- 📁 Files (document uploads)
- 📍 Matching (location-based search)

### Frontend (`/project`)
React + Vite with Redux Toolkit & TypeScript

```
src/
├── components/      # All UI components
│   ├── Auth/       # Login, signup
│   ├── Booking/    # Book service
│   ├── Dashboard/  # User dashboard
│   ├── ProviderPanel/
│   ├── Messages/   # Chat interface
│   ├── Services/   # Browse services
│   └── ... (more)
├── store/          # Redux state
│   ├── slices/     # 6 slices (auth, booking, etc.)
│   ├── api/        # 6 async thunks
│   └── hooks.js    # Custom hooks
├── services/       # Axios HTTP client
└── types/          # TypeScript definitions
```

**6 Redux Slices:**
- Auth (user, OTP, profile)
- Bookings (my bookings & jobs)
- Providers (profiles, search)
- Wallet (balance, transactions)
- Notifications (booking updates)
- Categories (service types)

---

## 🛠️ Tech Stack

**Backend:** Express.js • Prisma • PostgreSQL • Redis • Socket.io • JWT • Bcrypt • Zod • Nodemailer

**Frontend:** React • Next.js • Redux Toolkit • Axios • Tailwind CSS • TypeScript • Leaflet

---

## 📚 API Endpoints

Base URL: `http://localhost:8080/api/v1`

| Module | Endpoints |
|--------|-----------|
| **Auth** | POST `/auth/signup`, `/auth/signin`, `/auth/generate-otp`, `/auth/verify-otp` |
| **Booking** | POST `/booking/create`, GET `/booking/my-bookings`, PUT `/booking/:id/status` |
| **Provider** | GET `/provider/search`, `/provider/nearby`, POST `/provider/profile` |
| **Wallet** | GET `/wallet/balance`, `/wallet/transactions`, POST `/wallet/topup` |
| **Reviews** | POST `/reviews/create`, GET `/reviews/provider/:id` |
| **Messages** | POST `/messages/send`, GET `/messages/conversation/:id` |
| **Notifications** | GET `/notifications`, PUT `/notifications/:id/read` |
| **Categories** | GET `/categories` |

**Swagger Docs:** `http://localhost:8080/api-docs` (after backend starts)

---

## 🗄️ Database Models

12 Core Models:
- User (customers, providers, admins)
- ProviderProfile (ratings, availability)
- Booking (service requests)
- Wallet (user balances)
- WalletTransaction (payment history)
- ServiceCategory (plumbing, electrical, etc.)
- Review (ratings & feedback)
- Message (chat messages)
- Notification (booking alerts)
- File (uploads)
- AvailabilitySlot (provider schedules)
- Coupon (discount codes)

---

## 📊 Project Status

### Backend (70/100)
✅ **Completed:**
- 3-layer architecture (services → controllers → routes)
- 12 services fully implemented
- JWT authentication with OTP
- Wallet system with transactions
- Location-based provider matching
- Real-time Socket.io communication
- Error handling middleware

⚠️ **Pending (10 hours):**
- Input validation on all endpoints
- Rate limiting
- Pagination on list endpoints
- Search/filter capabilities
- Password reset flow
- API documentation (Swagger)

### Frontend (80/100)
✅ **Completed:**
- Redux Toolkit (6 slices)
- Async thunks with Axios
- Protected routes
- All main components
- Real-time updates

⚠️ **Pending:**
- Error boundaries
- Loading state optimization
- Offline support

---

## 🚀 Development

```bash
# Backend development
cd backend
npm run dev          # Runs on :8080
npm run lint         # Code quality check

# Frontend development
cd project
npm run dev          # Runs on :5173
npm run build        # Production build
npm run type-check   # TypeScript check
```

---

## 📖 Documentation

- **[Backend README](./backend/README.md)** - Detailed backend setup & API docs
- **[IMPLEMENTATION_GUIDE.md](./backend/IMPLEMENTATION_GUIDE.md)** - Fix implementation steps
- **[Project README](./README.md)** - Full project documentation

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make changes and test: `npm run lint`
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/new-feature`
5. Open a pull request

---

## 📝 Environment Setup

**Backend (.env):**
```
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/parichay
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```
VITE_API_URL=http://localhost:8080/api/v1
VITE_SOCKET_URL=http://localhost:8080
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check PORT 8080 is free: `netstat -ano \| findstr :8080` |
| DB connection error | Verify DATABASE_URL format & PostgreSQL is running |
| Frontend API fails | Ensure backend runs on :8080 & VITE_API_URL is correct |
| Socket.io error | Check CORS_ORIGIN in backend .env |

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

## 👨‍💻 Author

**Aditya Singh** - [GitHub](https://github.com/aditya3012singh)

---

<div align="center">

Built with ❤️ for urban services

[Backend README](./backend/README.md) • [Implementation Guide](./backend/IMPLEMENTATION_GUIDE.md)

</div>
