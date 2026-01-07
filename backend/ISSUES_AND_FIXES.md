# Backend Issues & Missing Components

## ✅ What's Working

1. **File Structure**: All files renamed correctly to `.service.js`, `.controller.js`, `.route.js` format
2. **Imports**: All imports updated correctly across services, controllers, and routes
3. **Route Mounting**: All routes properly mounted in index.js at `/api/v1/*`
4. **Prisma**: Configured and migrations exist
5. **Redis**: Client initialized in index.js
6. **Socket.io**: Basic setup exists in index.js
7. **Validators**: Zod schemas defined in ValidateUser.js

---

## ❌ Missing/Issues Found

### 1. **Missing nodemailer Package**
**Issue**: `auth.service.js` imports nodemailer but it's not in package.json
**Fix Required**: Install nodemailer
```bash
npm install nodemailer
```

### 2. **Missing .env File**
**Issue**: No `.env` file exists in backend directory
**Required Variables**:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/parichay"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Email (for OTP)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-specific-password"

# Twilio (optional - for SMS)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Server
PORT=8000
NODE_ENV="development"

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

### 3. **Socket Handler Implementation Issues**
**File**: `backend/src/socket/matchHandler.js`
**Issues**:
- References undefined `haversineDistance` and `getProvidersByCategory`
- Should import from services

**Fix**:
```javascript
import { findNearbyProviders } from "../services/match.service.js";
import { haversineDistance } from "../lib/geoHelpers.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function setupMatchingSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("request-service", async (data) => {
      const { userLat, userLon, serviceId, category } = data;

      try {
        // Use the service to find nearby providers
        const providers = await findNearbyProviders(userLat, userLon, 10);

        // Notify nearby providers
        providers.forEach((provider) => {
          io.to(provider.userId).emit("service-request", {
            customer: socket.id,
            location: { lat: userLat, lon: userLon },
            serviceId,
            category,
          });
        });

        // Confirm to customer
        socket.emit("providers-notified", {
          count: providers.length,
          providers: providers.map(p => ({
            id: p.id,
            name: p.User.name,
            distance: haversineDistance(userLat, userLon, p.latitude, p.longitude)
          }))
        });
      } catch (error) {
        socket.emit("error", { message: "Failed to find providers" });
      }
    });

    socket.on("provider-accept", async (data) => {
      const { bookingId, providerId } = data;
      // Notify customer that provider accepted
      io.to(data.customerId).emit("provider-accepted", {
        providerId,
        bookingId
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
```

### 4. **Missing Zod Package**
**Issue**: ValidateUser.js uses Zod but it might not be installed
**Check**: Run `npm list zod`
**Fix if missing**: `npm install zod`

### 5. **CORS Configuration**
**Issue**: index.js has `origin: "*"` which is insecure
**Fix**: Update to use environment variable
```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
```

### 6. **Missing Validation Integration**
**Issue**: Controllers don't use Zod schemas from ValidateUser.js
**Example Fix for auth.controller.js**:
```javascript
import { signupSchema, loginSchema } from "../validators/ValidateUser.js";

export const signupController = async (req, res) => {
  try {
    // Validate input
    const validatedData = signupSchema.parse(req.body);
    const result = await signupUser(validatedData);
    res.status(201).json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(400).json({ message: error.message });
  }
};
```

### 7. **Missing Error Handler Middleware**
**Issue**: No global error handler
**Create**: `backend/src/middlewares/errorHandler.js`
```javascript
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
};
```

Then add to index.js AFTER all routes:
```javascript
import { errorHandler } from "./middlewares/errorHandler.js";

// ... all routes ...

// Error handler (must be last)
app.use(errorHandler);
```

### 8. **Missing Upload Directory**
**Issue**: Multer uploads need a directory
**Fix**: Add to index.js or create on server start
```javascript
import fs from 'fs';
import path from 'path';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
```

### 9. **Match Service Missing Category Filter**
**Issue**: `findNearbyProviders` doesn't filter by serviceId
**Fix in match.service.js**:
```javascript
export const findNearbyProviders = async (latitude, longitude, radiusKm = 10, serviceId = null) => {
  const whereClause = {
    availability: true,
    verified: true,
  };

  if (serviceId) {
    whereClause.services = {
      some: {
        serviceId: serviceId
      }
    };
  }

  const providers = await prisma.providerProfile.findMany({
    where: whereClause,
    include: {
      User: {
        select: {
          name: true,
          email: true,
          phone: true,
        }
      },
      services: {
        include: {
          service: true
        }
      }
    }
  });

  const nearby = providers.filter((p) => {
    const dist = haversineDistance(latitude, longitude, p.latitude, p.longitude);
    return dist <= radiusKm;
  });

  return nearby.map(p => ({
    ...p,
    distance: haversineDistance(latitude, longitude, p.latitude, p.longitude)
  }));
};
```

---

## 🔧 Quick Fix Commands

```bash
# 1. Install missing packages
cd backend
npm install nodemailer zod

# 2. Create .env file
# Copy .env.example or create manually with required variables

# 3. Create uploads directory
mkdir uploads

# 4. Test the server
npm run dev
```

---

## 📋 Testing Checklist

After fixes:
- [ ] Server starts without errors
- [ ] All routes accessible at /api/v1/*
- [ ] OTP email sending works
- [ ] Redis connection successful
- [ ] Prisma database connected
- [ ] JWT authentication working
- [ ] File uploads working
- [ ] Socket.io connections working
- [ ] Validation errors returned correctly

---

## 🎯 Priority Order

1. **HIGH**: Install nodemailer, create .env file
2. **HIGH**: Fix socket handler imports
3. **MEDIUM**: Add error handler middleware
4. **MEDIUM**: Add validation to controllers
5. **MEDIUM**: Fix CORS configuration
6. **LOW**: Create uploads directory
7. **LOW**: Add category filter to match service
