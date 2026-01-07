# Backend Restructuring - New Architecture

## 📋 New Directory Structure

```
backend/
├── src/
│   ├── index.js                         # Main server entry point
│   ├── controllers/                     # Request handlers (HTTP layer)
│   │   ├── authController.js            # Auth operations
│   │   ├── bookingController.js         # Booking operations
│   │   ├── providerController.js        # Provider profile operations
│   │   ├── walletController.js          # Wallet operations
│   │   ├── categoryController.js        # Category operations
│   │   ├── couponController.js          # Coupon operations
│   │   ├── reviewController.js          # Review operations
│   │   ├── messageController.js         # Message operations
│   │   ├── notificationController.js    # Notification operations
│   │   ├── availabilityController.js    # Availability slot operations
│   │   ├── fileController.js            # File operations
│   │   ├── matchController.js           # Matching operations
│   │   └── geoHelpers.js                # Geographic utilities
│   ├── services/                        # Business logic layer
│   │   ├── authService.js               # Authentication logic
│   │   ├── bookingService.js            # Booking logic
│   │   ├── providerService.js           # Provider logic
│   │   ├── walletService.js             # Wallet logic
│   │   ├── categoryService.js           # Category logic
│   │   ├── couponService.js             # Coupon logic
│   │   ├── reviewService.js             # Review logic
│   │   ├── messageService.js            # Message logic
│   │   ├── notificationService.js       # Notification logic
│   │   ├── availabilityService.js       # Availability logic
│   │   ├── fileService.js               # File logic
│   │   └── matchService.js              # Matching logic
│   ├── routes/                          # API route definitions
│   │   ├── user.js                      # User/Auth routes
│   │   ├── providerProfile.js           # Provider profile routes
│   │   ├── booking.js                   # Booking routes
│   │   ├── wallet.js                    # Wallet routes
│   │   ├── availabilitySlot.js          # Availability routes
│   │   ├── categoryService.js           # Category routes
│   │   ├── coupon.js                    # Coupon routes
│   │   ├── reviews.js                   # Review routes
│   │   ├── messages.js                  # Message routes
│   │   ├── notification.js              # Notification routes
│   │   ├── files.js                     # File routes
│   │   └── match.js                     # Match routes
│   ├── middlewares/                     # Express middlewares
│   │   ├── authMiddleware.js            # JWT authentication
│   │   ├── isAdmin.js                   # Admin role verification
│   │   └── s3upload.js                  # S3 file upload
│   ├── socket/                          # WebSocket handlers
│   │   └── matchHandler.js              # Real-time matching
│   └── validators/                      # Input validation schemas
│       └── ValidateUser.js              # Zod validation schemas
├── prisma/                              # Database
│   ├── schema.prisma                    # Database schema
│   ├── seed.js                          # Database seeding
│   └── migrations/                      # Database migrations
├── uploads/                             # Local file storage
├── package.json
└── README.md
```

---

## 🏗️ Architecture Layers

### 1. **Routes Layer** (`/routes`)
- **Responsibility**: Define API endpoints and HTTP methods
- **Pattern**: Clean, minimal route definitions that delegate to controllers
- **Example**:
```javascript
router.post("/", authMiddleware, createBookingController);
```

### 2. **Controllers Layer** (`/controllers`)
- **Responsibility**: Handle HTTP requests/responses and validation
- **Pattern**: Accept request, call service, return response
- **Benefits**:
  - Decouples HTTP logic from business logic
  - Easy to test
  - Centralized error handling
- **Example**:
```javascript
export const createBookingController = async (req, res) => {
  try {
    const booking = await createBooking({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### 3. **Services Layer** (`/services`)
- **Responsibility**: Implement business logic and data operations
- **Pattern**: Pure business functions that interact with database
- **Benefits**:
  - Reusable logic
  - Easy to test independently
  - Database interaction centralized
  - Can be used by multiple controllers or Socket.io handlers
- **Example**:
```javascript
export const createBooking = async (bookingData) => {
  try {
    const booking = await prisma.booking.create({
      data: { ...bookingData, dateTime: new Date(bookingData.dateTime) },
    });
    return booking;
  } catch (error) {
    throw error;
  }
};
```

### 4. **Middlewares Layer** (`/middlewares`)
- **Responsibility**: Provide cross-cutting concerns
- **Includes**:
  - Authentication (JWT verification)
  - Authorization (role checking)
  - File uploads (Multer)

### 5. **Validators Layer** (`/validators`)
- **Responsibility**: Input validation using Zod schemas
- **Benefit**: Type-safe validation across the application

### 6. **Socket Layer** (`/socket`)
- **Responsibility**: Handle real-time WebSocket events
- **Can use**: Services directly for business logic

---

## 🔄 Data Flow Example: Create Booking

```
User Request
    ↓
[Routes] → POST /api/v1/booking
    ↓
[Middleware] → authMiddleware (verify JWT)
    ↓
[Controller] → createBookingController
    ├─ Validate request
    ├─ Extract userId from req.user
    ├─ Call service
    ├─ Handle response/error
    ↓
[Service] → createBooking(bookingData)
    ├─ Execute business logic
    ├─ Interact with database
    ├─ Return result or throw error
    ↓
Response to Client
```

---

## ✨ Benefits of This Architecture

### 1. **Separation of Concerns**
- Routes: Define endpoints
- Controllers: Handle HTTP
- Services: Business logic
- Middlewares: Cross-cutting concerns

### 2. **Reusability**
- Services can be used by multiple controllers
- Services can be used by Socket.io handlers
- Validation schemas can be shared

### 3. **Testability**
- Controllers: Easy to mock services
- Services: Pure functions, easy to unit test
- Routes: Can mock controllers

### 4. **Maintainability**
- Clear structure makes code easy to navigate
- Each layer has single responsibility
- Easy to debug (know where to look)

### 5. **Scalability**
- Easy to add new features
- Easy to add new routes
- Business logic isolated from HTTP concerns

---

## 📊 Service Usage Examples

### Creating a Notification from Service

```javascript
// In a route or controller
import { createNotification } from "../services/notificationService.js";

// Create notification
await createNotification(userId, "Your booking was accepted!", "BOOKING");
```

### Using in Socket.io Handler

```javascript
// In socket/matchHandler.js
import { createNotification } from "../services/notificationService.js";
import { findNearbyProviders } from "../services/matchService.js";

socket.on("findProviders", async (data) => {
  const nearby = await findNearbyProviders(data.lat, data.lng);
  
  for (const provider of nearby) {
    await createNotification(provider.userId, "New booking request!", "BOOKING");
  }
});
```

---

## 🚀 Migration Checklist

- ✅ Services layer created with business logic
- ✅ Controllers layer created for HTTP handling
- ✅ Routes updated to use controllers
- ✅ Index.js updated with all route imports
- ✅ Middlewares maintained in place
- ✅ Socket layer ready for service integration
- ✅ Validators in place

---

## 📝 Future Enhancements

1. **Error Handling**: Create custom error classes
2. **Logging**: Add structured logging
3. **Caching**: Add Redis caching in services
4. **Rate Limiting**: Add rate limiting middleware
5. **Testing**: Add unit and integration tests
6. **API Documentation**: Add Swagger/OpenAPI docs

---

**Architecture Version**: 2.0 (With Services Layer)
**Date**: January 2026
