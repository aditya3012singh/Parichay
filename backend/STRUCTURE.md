# Backend Structure Overview

## 📂 Complete File Organization

```
backend/
├── src/
│   ├── index.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── providerController.js
│   │   ├── walletController.js
│   │   ├── categoryController.js
│   │   ├── couponController.js
│   │   ├── reviewController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── availabilityController.js
│   │   ├── fileController.js
│   │   ├── matchController.js
│   │   └── geoHelpers.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── bookingService.js
│   │   ├── providerService.js
│   │   ├── walletService.js
│   │   ├── categoryService.js
│   │   ├── couponService.js
│   │   ├── reviewService.js
│   │   ├── messageService.js
│   │   ├── notificationService.js
│   │   ├── availabilityService.js
│   │   ├── fileService.js
│   │   └── matchService.js
│   │
│   ├── routes/
│   │   ├── user.js
│   │   ├── providerProfile.js
│   │   ├── booking.js
│   │   ├── wallet.js
│   │   ├── availabilitySlot.js
│   │   ├── categoryService.js
│   │   ├── coupon.js
│   │   ├── reviews.js
│   │   ├── messages.js
│   │   ├── notification.js
│   │   ├── files.js
│   │   └── match.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── isAdmin.js
│   │   └── s3upload.js
│   │
│   ├── socket/
│   │   └── matchHandler.js
│   │
│   └── validators/
│       └── ValidateUser.js
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
│       ├── migration_lock.toml
│       ├── 20250705041950_init_schema/
│       ├── 20250705043432_full_feature_schema/
│       ├── 20250705051235_full_feature_schema/
│       └── 20250708161025_full_feature_schema/
│
├── uploads/                    (Local file storage)
│
├── package.json
├── README.md                   (API Documentation)
├── ARCHITECTURE.md            (Architecture Documentation)
└── .env                        (Environment variables)
```

---

## 🎯 Layer Responsibilities

### **Routes** (12 route files)
Entry points for all API requests
- Route definition
- Middleware attachment
- Controller invocation

### **Controllers** (12 controller files)
HTTP request handling
- Request validation
- Response formatting
- Error handling

### **Services** (12 service files)
Business logic implementation
- Database operations
- Business rules
- Data transformation

### **Middlewares** (3 files)
Cross-cutting concerns
- Authentication
- Authorization
- File uploads

### **Socket** (1 file)
Real-time communication
- Event handling
- Service integration

### **Validators** (1 file)
Input validation
- Schema definitions
- Type safety

---

## 🔗 Request Journey Example: Create Booking

```
HTTP POST /api/v1/booking
    ↓
[routes/booking.js]
  └─ router.post("/", authMiddleware, createBookingController)
    ↓
[middlewares/authMiddleware.js]
  └─ Verify JWT token
    ↓
[controllers/bookingController.js]
  └─ createBookingController(req, res)
     ├─ Validate: req.body with schema
     ├─ Extract: userId from req.user
     ├─ Call: createBooking service
    ↓
[services/bookingService.js]
  └─ createBooking(bookingData)
     ├─ Execute: prisma.booking.create()
     ├─ Return: booking object
    ↓
[controllers/bookingController.js]
  └─ res.status(201).json({ booking })
    ↓
Client Response: { message: "Booking created", booking: {...} }
```

---

## 🚦 Data Flow: Services to Socket.io

```
Socket Event Received
    ↓
[socket/matchHandler.js]
    ├─ Call: findNearbyProviders(lat, lng)  ← Service
    ├─ Call: createNotification(userId, msg) ← Service
    └─ Emit: Updated data to client
```

---

## ✅ Completed Refactoring

### Created Files:
- ✅ 12 Service files
- ✅ 12 Controller files
- ✅ Updated 12 Route files
- ✅ ARCHITECTURE.md
- ✅ This structure document

### Updated Files:
- ✅ index.js (import paths)
- ✅ All route files (controller usage)

### Key Changes:
1. **Business Logic** moved to services
2. **HTTP Handling** moved to controllers
3. **Routes** now clean and minimal
4. **Reusability** improved with service layer
5. **Testability** enhanced with separation of concerns

---

## 📚 File Examples

### Service Example (authService.js)
```javascript
export const signupUser = async (userData) => {
  // Validate email verification
  // Hash password
  // Create user in DB
  // Generate JWT
  // Return user + token
}
```

### Controller Example (authController.js)
```javascript
export const signupController = async (req, res) => {
  try {
    const result = await signupUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
```

### Route Example (user.js)
```javascript
router.post("/signup", signupController);
```

---

**Architecture Pattern**: MVC-inspired with Services Layer
**Layers**: Routes → Controllers → Services → Database
**Benefits**: Scalability, Maintainability, Testability, Reusability
