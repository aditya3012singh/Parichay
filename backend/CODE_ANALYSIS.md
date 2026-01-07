# 🔍 Backend Code Analysis & Recommendations

Generated: January 7, 2026

---

## ✅ What's Working Well

### Architecture
- ✅ Clean 3-layer architecture (Services → Controllers → Routes)
- ✅ Proper file organization with dot notation (.service.js, .controller.js, .route.js)
- ✅ All 12 services implemented with business logic
- ✅ Comprehensive Prisma schema with proper relationships
- ✅ Zod validation schemas defined and ready to use

### Authentication & Security
- ✅ JWT-based authentication with authMiddleware
- ✅ Admin role checking with isAdmin middleware
- ✅ OTP-based signup flow with email verification
- ✅ Redis caching for OTP with TTL (10 minutes)
- ✅ Bcrypt password hashing
- ✅ Global error handler for Zod, JWT, Prisma errors

### Database
- ✅ Well-designed Prisma schema with proper enums
- ✅ Proper foreign key relationships
- ✅ Indexes on latitude/longitude for geographic queries
- ✅ All necessary models (User, Booking, Wallet, Review, etc.)

### API Features
- ✅ WebSocket support for real-time provider matching
- ✅ File upload handling with Multer
- ✅ Wallet and transaction system
- ✅ Review and rating system
- ✅ Provider availability slot management
- ✅ Notification system
- ✅ Coupon/discount system

---

## ⚠️ Critical Issues

### 1. **Missing Input Validation in Controllers** (HIGH PRIORITY)
**Problem:** Controllers accept requests but don't validate using Zod schemas

**Current:**
```javascript
// booking.controller.js - NO VALIDATION
export const createBookingController = async (req, res) => {
  const userId = req.user.id;
  const booking = await createBooking({
    ...req.body,  // ❌ No validation!
    userId,
  });
};
```

**Should be:**
```javascript
export const createBookingController = async (req, res) => {
  try {
    const userId = req.user.id;
    const validatedData = bookingSchema.parse({
      ...req.body,
      userId,
    });
    const booking = await createBooking(validatedData);
    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    next(error); // Error handler formats Zod errors
  }
};
```

**Files needing validation:**
- auth.controller.js (all endpoints)
- booking.controller.js (all endpoints)
- provider.controller.js (all endpoints)
- wallet.controller.js (all endpoints)
- review.controller.js (all endpoints)
- message.controller.js (all endpoints)
- notification.controller.js (all endpoints)
- availability.controller.js (all endpoints)
- category.controller.js (all endpoints)
- coupon.controller.js (all endpoints)
- file.controller.js (all endpoints)
- match.controller.js (all endpoints)

---

### 2. **No Rate Limiting** (HIGH PRIORITY)
**Problem:** API has no rate limiting - vulnerable to abuse and DDoS

**Solution:** Add express-rate-limit
```bash
npm install express-rate-limit
```

**Implementation in index.js:**
```javascript
import rateLimit from "express-rate-limit";

// General rate limit: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});

// Auth rate limit: 5 requests per 15 minutes (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later",
});

// Apply general limiter to all routes
app.use("/api/", generalLimiter);

// Apply stricter limit to auth endpoints
app.use("/api/v1/auth/signin", authLimiter);
app.use("/api/v1/auth/generate-otp", authLimiter);
```

---

### 3. **No Request Size Limits** (HIGH PRIORITY)
**Problem:** No limits on request payload - vulnerable to large payload attacks

**Solution in index.js:**
```javascript
// Add size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
```

---

### 4. **Missing API Logging** (HIGH PRIORITY)
**Problem:** No request/response logging for debugging and monitoring

**Solution:** Add Morgan logger
```bash
npm install morgan
```

**Implementation in index.js:**
```javascript
import morgan from "morgan";

// Request logging
app.use(morgan("combined"));

// Or for development:
// app.use(morgan("dev"));
```

---

### 5. **Incomplete Booking Status Lifecycle** (MEDIUM PRIORITY)
**Problem:** Booking status transitions aren't enforced

**Current valid statuses:** PENDING → ACCEPTED → COMPLETED or CANCELLED

**Issue:** No validation that transitions follow logical flow
- Can't go from COMPLETED to PENDING
- No provider confirmation before ACCEPTED
- No customer rating requirement after COMPLETED

**Solution in booking.service.js:**
```javascript
export const updateBookingStatus = async (bookingId, status) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  
  const validTransitions = {
    PENDING: ["ACCEPTED", "CANCELLED"],
    ACCEPTED: ["COMPLETED", "CANCELLED"],
    COMPLETED: [], // Terminal state
    CANCELLED: [], // Terminal state
  };

  if (!validTransitions[booking.status]?.includes(status)) {
    throw new Error(`Cannot transition from ${booking.status} to ${status}`);
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
};
```

---

### 6. **No Refund Logic** (MEDIUM PRIORITY)
**Problem:** When booking is cancelled, user should get refund to wallet

**Missing from booking.service.js:**
```javascript
export const cancelBooking = async (bookingId) => {
  const booking = await prisma.booking.findUnique({ 
    where: { id: bookingId }
  });

  // Refund to user wallet
  await prisma.wallet.update({
    where: { userId: booking.userId },
    data: { balance: { increment: booking.price } },
  });

  // Log transaction
  await prisma.walletTransaction.create({
    data: {
      userId: booking.userId,
      walletId: (await prisma.wallet.findUnique({ 
        where: { userId: booking.userId } 
      })).id,
      amount: booking.price,
      type: "CREDIT",
      source: "REFUND",
    },
  });

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
};
```

---

### 7. **No Pagination** (MEDIUM PRIORITY)
**Problem:** Endpoints return ALL records - causes performance issues

**Current:**
```javascript
// Gets ALL bookings at once
export const getUserBookings = async (userId) => {
  return prisma.booking.findMany({
    where: { userId },
  });
};
```

**Should be:**
```javascript
export const getUserBookings = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.count({ where: { userId } }),
  ]);

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
```

---

### 8. **No Search/Filter Capabilities** (MEDIUM PRIORITY)
**Problem:** Cannot search or filter providers, bookings, etc.

**Example for findNearbyProviders:**
```javascript
export const findNearbyProviders = async (
  latitude, 
  longitude, 
  radiusKm = 10,
  category = null,      // NEW
  minRating = 0,        // NEW
  availableOnly = true  // NEW
) => {
  let where = {
    latitude: {
      gte: latitude - radiusKm / 111,
      lte: latitude + radiusKm / 111,
    },
    longitude: {
      gte: longitude - radiusKm / 111,
      lte: longitude + radiusKm / 111,
    },
  };

  if (category) {
    where.categories = { has: category };
  }

  if (availableOnly) {
    where.availability = true;
  }

  const providers = await prisma.providerProfile.findMany({
    where,
    include: { user: true },
  });

  // Filter by distance and rating
  return providers.filter((p) => {
    const distance = haversineDistance(
      latitude, longitude,
      p.latitude, p.longitude
    );
    return distance <= radiusKm && p.user.rating >= minRating;
  });
};
```

---

### 9. **No Transaction Handling** (MEDIUM PRIORITY)
**Problem:** When multiple database operations fail, partial data is saved

**Example with wallet topup:**
```javascript
// Current - NOT atomic
export const processBookingPayment = async (userId, bookingId, amount) => {
  // Step 1: Deduct from wallet
  await prisma.wallet.update({
    where: { userId },
    data: { balance: { decrement: amount } },
  });

  // Step 2: Create transaction (could fail, wallet already deducted!)
  await prisma.walletTransaction.create({
    data: { userId, amount, type: "DEBIT", source: "BOOKING" },
  });

  // Step 3: Update booking (could fail!)
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "ACCEPTED" },
  });
};
```

**Fixed with transactions:**
```javascript
export const processBookingPayment = async (userId, bookingId, amount) => {
  return await prisma.$transaction(async (tx) => {
    // All or nothing
    const wallet = await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });

    if (wallet.balance < 0) {
      throw new Error("Insufficient balance");
    }

    await tx.walletTransaction.create({
      data: { userId, amount, type: "DEBIT", source: "BOOKING" },
    });

    return tx.booking.update({
      where: { id: bookingId },
      data: { status: "ACCEPTED" },
    });
  });
};
```

---

### 10. **No API Documentation** (MEDIUM PRIORITY)
**Problem:** No OpenAPI/Swagger documentation for frontend developers

**Solution:** Add Swagger
```bash
npm install swagger-jsdoc swagger-ui-express
```

**Create swagger.js:**
```javascript
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Parichay API",
      version: "1.0.0",
      description: "Service marketplace API",
    },
    servers: [
      { url: "http://localhost:8080", description: "Development" },
      { url: "https://api.parichay.com", description: "Production" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.route.js"],
};

const specs = swaggerJSDoc(options);
export default specs;
```

**In index.js:**
```javascript
import swaggerUiExpress from "swagger-ui-express";
import specs from "./swagger.js";

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
```

---

### 11. **No Caching Headers** (MEDIUM PRIORITY)
**Problem:** API doesn't use HTTP caching - more network bandwidth

**Solution - Add cache middleware:**
```javascript
// middleware/cacheMiddleware.js
export const cacheMiddleware = (duration = 60) => {
  return (req, res, next) => {
    res.set("Cache-Control", `public, max-age=${duration}`);
    next();
  };
};

// Usage in routes
app.use("/api/v1/categories", cacheMiddleware(3600)); // Cache for 1 hour
```

---

### 12. **No Data Relationships in Responses** (MEDIUM PRIORITY)
**Problem:** Some responses don't include related data that UI needs

**Current booking response - missing provider details:**
```javascript
// Gets booking but provider is just an ID
const booking = await prisma.booking.findUnique({
  where: { id: bookingId },
  // ❌ Missing: include: { provider: true, user: true }
});
```

**Should include related data:**
```javascript
const booking = await prisma.booking.findUnique({
  where: { id: bookingId },
  include: {
    user: { select: { id: true, name: true, phone: true } },
    provider: { 
      include: { providerProfile: true }
    },
  },
});
```

---

### 13. **No Password Reset Flow** (LOW PRIORITY)
**Problem:** Users can't reset forgotten passwords

**Solution - Add to auth.route.js:**
```javascript
// forgot-password route
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    // Generate reset token, send via email
    // Store in Redis with expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    await redis.set(`reset-token:${resetToken}`, email, "EX", 3600);
    // Send email with reset link
    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    next(error);
  }
});
```

---

### 14. **Socket Handler Improvements** (LOW PRIORITY)
**Problem:** Socket handler is basic, could have better features

**Improvements to matchHandler.js:**
```javascript
// Add user presence tracking
socket.on("user-online", (userId) => {
  socket.join(`user-${userId}`);
  io.emit("user-status", { userId, status: "online" });
});

// Add typing indicators
socket.on("typing", ({ conversationId, userId }) => {
  io.to(conversationId).emit("user-typing", { userId });
});

// Add read receipts
socket.on("message-read", ({ messageId, conversationId }) => {
  io.to(conversationId).emit("read-receipt", { messageId });
});
```

---

### 15. **No Duplicate Provider Profile Prevention** (LOW PRIORITY)
**Problem:** User can create multiple provider profiles

**Solution in provider.service.js:**
```javascript
export const saveProviderProfile = async (userId, profileData) => {
  const existingProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    return prisma.providerProfile.update({
      where: { userId },
      data: profileData,
    });
  }

  return prisma.providerProfile.create({
    data: { userId, ...profileData },
  });
};
```

---

## 📊 Priority Checklist

### 🔴 Critical (Do First)
- [ ] Add Zod validation to all controllers
- [ ] Add express-rate-limit
- [ ] Add request size limits
- [ ] Fix socket handler state management

### 🟠 High (Do Soon)
- [ ] Add request logging (morgan)
- [ ] Add pagination to list endpoints
- [ ] Add search/filter capabilities
- [ ] Add transaction handling for critical operations
- [ ] Add API documentation (Swagger)

### 🟡 Medium (Nice to Have)
- [ ] Add booking status lifecycle validation
- [ ] Add refund logic for cancelled bookings
- [ ] Add caching headers
- [ ] Add password reset flow
- [ ] Improve socket handler features

### 🟢 Low (Polish)
- [ ] Prevent duplicate provider profiles
- [ ] Add data relationships in responses
- [ ] Add error tracking (Sentry)
- [ ] Add metrics/monitoring

---

## 🎯 Quick Implementation Guide

### Step 1: Add Validation (20 mins)
Install dependencies → Add to each controller → Test

### Step 2: Add Rate Limiting & Size Limits (10 mins)
Add to index.js → Test with Postman

### Step 3: Add Logging (5 mins)
Add morgan import → Verify logs in terminal

### Step 4: Add Pagination (30 mins)
Update 12 services → Update controllers → Update frontend thunks

### Step 5: Add Swagger Docs (15 mins)
Create swagger.js → Add comments to routes → Test at /api-docs

---

## 📁 Files That Need Changes

| File | Issue | Priority |
|------|-------|----------|
| auth.controller.js | Missing validation | 🔴 |
| booking.controller.js | Missing validation | 🔴 |
| provider.controller.js | Missing validation | 🔴 |
| All other controllers | Missing validation | 🔴 |
| index.js | Missing rate limit | 🔴 |
| booking.service.js | Missing refund logic | 🟠 |
| All services | Missing pagination | 🟠 |
| match.service.js | Missing filters | 🟠 |
| matchHandler.js | Missing state handling | 🔴 |
| - | No API documentation | 🟠 |
| - | No password reset | 🟡 |

---

## 🚀 Next Steps

**Recommended order:**
1. Add validation to all controllers (highest impact)
2. Add rate limiting and size limits (security)
3. Add pagination (performance)
4. Add logging (debugging)
5. Add API docs (developer experience)

Would you like me to implement any of these? I can start with the most critical ones first.
