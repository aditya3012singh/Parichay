# Parichay Backend API

A comprehensive service marketplace API built with Node.js, Express, and Prisma. This backend powers the Parichay platform, connecting service providers with customers in an urban setting.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)

---

## 🎯 Project Overview

**Parichay** is an urban service marketplace platform that facilitates connections between service providers and customers. The backend provides a robust REST API with real-time messaging capabilities via Socket.io.

### Key Features:
- User authentication with OTP verification
- Provider profile management with geolocation
- Booking/Job management system
- Wallet and payment transactions
- Service categories and coupons
- Real-time messaging between users
- Review and rating system
- Notification system
- Real-time matching based on location

---

## 🛠️ Tech Stack

### Core Framework
- **Express.js** (v5.1.0) - Web framework
- **Node.js** - Runtime environment

### Database & ORM
- **PostgreSQL** - Primary database
- **Prisma** (v6.11.1) - ORM for database management

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management

### Real-time Communication
- **Socket.io** (v4.8.1) - WebSocket library for real-time features
- **Socket.io-client** (v4.8.1) - Client-side WebSocket

### Additional Services
- **Redis (ioredis)** - In-memory cache for OTP storage
- **Multer** (v2.0.1) - File upload handling
- **CORS** - Cross-origin resource sharing
- **Twilio** - SMS/calling services
- **UUID** - Unique identifier generation

### Development
- **Nodemon** - Auto-reload during development

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js                 # Main server entry point
│   ├── controllers/
│   │   └── geoHelpers.js        # Geographic distance calculations
│   ├── middlewares/
│   │   ├── authMiddleware.js    # JWT authentication middleware
│   │   ├── isAdmin.js           # Admin role verification
│   │   └── s3upload.js          # S3 file upload middleware
│   ├── routes/                  # API route handlers
│   │   ├── user.js              # Authentication & user management
│   │   ├── providerProfile.js   # Provider profile management
│   │   ├── availabilitySlot.js  # Provider availability slots
│   │   ├── booking.js           # Booking management
│   │   ├── wallet.js            # Wallet & transactions
│   │   ├── categoryService.js   # Service categories
│   │   ├── coupon.js            # Coupon management
│   │   ├── reviews.js           # Reviews & ratings
│   │   ├── messages.js          # Direct messaging
│   │   ├── notification.js      # User notifications
│   │   ├── match.js             # Geographic matching
│   │   └── files.js             # File uploads
│   ├── socket/
│   │   └── matchHandler.js      # Real-time matching via Socket.io
│   └── validators/
│       └── ValidateUser.js      # Input validation schemas
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.js                  # Database seeding script
│   └── migrations/              # Database migrations
├── uploads/                     # Local file storage
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

### Core Models

#### **User**
- Represents all system users (USER, PROVIDER, ADMIN roles)
- Stores authentication credentials and profile information
- Relations: Bookings, Wallet, Provider Profile, Reviews, Messages, Notifications, Files

#### **ProviderProfile**
- Extended profile for service providers
- Includes: categories, skills, hourly rate, location coordinates
- Uses geolocation indexing for efficient distance queries

#### **Booking**
- Records service requests between users and providers
- Status: PENDING → ACCEPTED → COMPLETED/CANCELLED
- Stores service details, pricing, and scheduling info

#### **Wallet**
- Stores user's account balance
- Used for payments and transactions

#### **WalletTransaction**
- Detailed transaction history
- Types: CREDIT, DEBIT
- Sources: TOPUP, REFUND, BOOKING

#### **ServiceCategory**
- Available service categories (e.g., plumbing, cleaning, etc.)
- Can be managed by admins

#### **Review**
- User reviews for providers
- Includes rating (1-5) and comments

#### **Notification**
- System notifications for users
- Types: BOOKING, WALLET, ADMIN
- Track read/unread status

#### **Message**
- Direct messages between users
- Tracks sender, receiver, timestamp

#### **AvailabilitySlot**
- Provider availability windows
- Time-based scheduling

#### **Coupon**
- Discount codes with expiration
- Tracks active/inactive status

#### **File**
- Document storage (profile pics, ID proofs, certificates)
- File types: PROFILE, ID_PROOF, CERTIFICATE, OTHER

#### **OTP**
- One-time passwords for email verification
- Stored with expiration times

---

## 🛣️ API Routes

### Base URL
```
http://localhost:8000/api/v1
```

---

### 👤 User Routes (`/api/v1/user`)

#### Authentication & User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/generate-otp` | Generate OTP for email verification | ❌ |
| POST | `/verify-otp` | Verify OTP code | ❌ |
| POST | `/signup` | Register new user (USER, PROVIDER, or ADMIN) | ❌ |
| POST | `/signin` | Login user and receive JWT token | ❌ |
| GET | `/check-admin` | Check if admin exists | ❌ |
| GET | `/check-user` | Check if user exists by email | ❌ |
| GET | `/me` | Get current logged-in user's profile | ✅ |
| GET | `/users` | Get all users (admin only) | ✅ (Admin) |
| PUT | `/update-profile` | Update user name or password | ✅ |
| DELETE | `/user` | Delete user by ID (admin only) | ✅ (Admin) |

#### Request Examples:

**Generate OTP:**
```json
{
  "email": "user@example.com"
}
```

**Verify OTP:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Signup:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securePassword123",
  "role": "USER"  // USER, PROVIDER, or ADMIN
}
```

**Signin:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

---

### 🏢 Provider Profile Routes (`/api/v1/provider-profile`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get current provider's profile | ✅ |
| POST | `/` | Create/Update provider profile | ✅ |
| GET | `/all` | Get all provider profiles | ❌ |

#### Request Example:

```json
{
  "categories": ["cleaning", "plumbing"],
  "skills": ["10 years experience"],
  "rate": 500,
  "availability": true,
  "description": "Professional service provider",
  "address": "123 Main St",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

---

### 📅 Availability Slot Routes (`/api/v1/availability`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create availability slot | ✅ (Provider) |
| GET | `/` | Get all slots for current provider | ✅ (Provider) |
| DELETE | `/:slotId` | Delete a slot | ✅ (Provider) |

#### Request Example:

```json
{
  "startTime": "2024-01-10T09:00:00Z",
  "endTime": "2024-01-10T17:00:00Z"
}
```

---

### 📦 Booking Routes (`/api/v1/booking`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new booking | ✅ |
| GET | `/my-bookings` | Get user's bookings | ✅ |
| GET | `/my-jobs` | Get provider's jobs/bookings | ✅ |
| PUT | `/:bookingId/status` | Update booking status | ✅ |

#### Request Example:

```json
{
  "providerId": "provider-uuid",
  "category": "cleaning",
  "dateTime": "2024-01-15T10:00:00Z",
  "location": "456 Oak St",
  "price": 1500,
  "notes": "2BHK apartment cleaning"
}
```

#### Booking Status Values:
- `PENDING` - Awaiting provider response
- `ACCEPTED` - Provider accepted
- `COMPLETED` - Service completed
- `CANCELLED` - Booking cancelled

---

### 💳 Wallet Routes (`/api/v1/wallet`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get current wallet balance | ✅ |
| GET | `/transactions` | View transaction history | ✅ |
| POST | `/topup` | Top up wallet balance | ✅ |

#### Request Example:

```json
{
  "amount": 5000
}
```

---

### 🏷️ Category Routes (`/api/v1/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all service categories | ❌ |
| POST | `/` | Create new category (admin only) | ✅ (Admin) |

#### Request Example:

```json
{
  "name": "Plumbing",
  "image": "https://example.com/plumbing.jpg"
}
```

---

### 🎟️ Coupon Routes (`/api/v1/coupons`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all active coupons | ✅ |
| POST | `/` | Create coupon (admin only) | ✅ (Admin) |

#### Request Example:

```json
{
  "code": "SAVE20",
  "discount": 20,
  "maxAmount": 5000,
  "expiryDate": "2024-12-31T23:59:59Z"
}
```

---

### ⭐ Review Routes (`/api/v1/reviews`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Submit a review | ✅ |
| GET | `/provider/:providerId` | Get reviews for a provider | ❌ |
| GET | `/provider/:providerId/average` | Get provider's average rating | ❌ |

#### Request Example:

```json
{
  "providerId": "provider-uuid",
  "rating": 5,
  "comment": "Excellent service!"
}
```

---

### 💬 Message Routes (`/api/v1/messages`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:receiverId` | Get conversation with user | ✅ |
| POST | `/` | Send a message | ✅ |

#### Request Example:

```json
{
  "receiverId": "user-uuid",
  "content": "Is your service available tomorrow?"
}
```

---

### 🔔 Notification Routes (`/api/v1/notifications`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all notifications | ✅ |
| PUT | `/:id/read` | Mark notification as read | ✅ |

---

### 📄 File Routes (`/api/v1/files`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload` | Upload a file | ✅ |
| GET | `/user/:userId` | Get user's uploaded files | ❌ |

#### File Types:
- `PROFILE` - Profile pictures
- `ID_PROOF` - Identity documents
- `CERTIFICATE` - Professional certificates
- `OTHER` - Other documents

---

### 🎯 Match Routes (`/api/v1/match`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/nearby` | Find nearby available providers | ✅ |

#### Request Example:

```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radiusKm": 10
}
```

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### Token Format:
```
Authorization: Bearer <jwt_token>
```

### Token Payload:
```json
{
  "id": "user-uuid",
  "role": "USER|PROVIDER|ADMIN"
}
```

### Token Expiration:
- Default: 1 hour

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- Redis (for OTP caching)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup PostgreSQL database**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed database (optional)**
   ```bash
   node prisma/seed.js
   ```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/parichay

# Redis (for OTP)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Email (Gmail with App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Twilio (optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# S3 (optional)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=us-east-1
```

---

## ▶️ Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
node src/index.js
```

### Health Check
The API runs on `http://localhost:8000` and returns:
```
GET http://localhost:8000/
Response: ✅ UrbanCo-style API running
```

---

## 🔄 Real-time Features (Socket.io)

The backend supports real-time communication through Socket.io:

### Match Handler (`/socket/matchHandler.js`)
- Manages real-time provider matching
- Handles location-based notifications
- Coordinates booking updates

### Connection Events:
```javascript
// Client connects
socket.on('connect', () => { /* ... */ });

// Listen for real-time updates
socket.on('providerMatched', (data) => { /* ... */ });
socket.on('bookingUpdated', (data) => { /* ... */ });
```

---

## 📝 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { /* ... */ }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": [ /* validation errors */ ]
}
```

### Status Codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 🧪 Testing

Currently, no automated tests are configured. To add tests:

```bash
npm install --save-dev jest supertest
```

---

## 🚀 Deployment

### Deploying to Production

1. **Set environment variables** on your hosting platform
2. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```
3. **Start server**:
   ```bash
   npm start
   ```

### Recommended Hosting:
- Heroku
- Railway
- DigitalOcean
- AWS EC2
- Render

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [JWT Documentation](https://jwt.io/)

---

## 📄 License

ISC

---

## 👥 Contributors

- Aditya Singh (@aditya3012singh)

---

## 🤝 Support

For issues or questions, please open a GitHub issue or contact the development team.

---

**Last Updated**: January 2026
