# Redux Toolkit Setup

## Store Structure

The Redux store is configured with the following slices:

- **auth**: Authentication and user management
- **booking**: Booking management (user bookings and provider jobs)
- **provider**: Provider profile and discovery
- **wallet**: Wallet balance and transactions
- **notification**: User notifications
- **category**: Service categories

## Slices

### Auth Slice (`store/slices/auth.slice.js`)

**State:**
- `user`: Current user object
- `token`: JWT authentication token
- `loading`: Loading state
- `error`: Error message
- `isAuthenticated`: Authentication status
- `otpSent`: OTP sent status
- `otpVerified`: OTP verification status

**Actions:**
- `logout()`: Clear user session
- `clearError()`: Clear error state
- `setCredentials()`: Set user and token

**Async Thunks:**
- `generateOTP`: Send OTP to email
- `verifyOTP`: Verify OTP code
- `signup`: Create new user account
- `signin`: Login existing user
- `getCurrentUser`: Fetch current user data
- `updateProfile`: Update user profile

### Booking Slice (`store/slices/booking.slice.js`)

**State:**
- `bookings`: Array of user bookings
- `jobs`: Array of provider jobs
- `currentBooking`: Currently selected booking
- `loading`: Loading state
- `error`: Error message

**Actions:**
- `clearBookingError()`: Clear error state
- `setCurrentBooking()`: Set active booking

**Async Thunks:**
- `createBooking`: Create new booking
- `getMyBookings`: Fetch user's bookings
- `getMyJobs`: Fetch provider's jobs
- `updateBookingStatus`: Update booking status

### Provider Slice (`store/slices/provider.slice.js`)

**State:**
- `profile`: Provider profile
- `providers`: All providers
- `nearbyProviders`: Providers near user location
- `loading`: Loading state
- `error`: Error message

**Actions:**
- `clearProviderError()`: Clear error state
- `clearNearbyProviders()`: Clear nearby providers list

**Async Thunks:**
- `createProviderProfile`: Create provider profile
- `getProviderProfile`: Fetch provider profile
- `updateProviderProfile`: Update provider profile
- `getAllProviders`: Fetch all providers
- `findNearbyProviders`: Find providers near location

### Wallet Slice (`store/slices/wallet.slice.js`)

**State:**
- `balance`: Wallet balance
- `transactions`: Transaction history
- `loading`: Loading state
- `error`: Error message

**Actions:**
- `clearWalletError()`: Clear error state

**Async Thunks:**
- `getWalletBalance`: Fetch wallet balance
- `getTransactions`: Fetch transaction history
- `topUpWallet`: Add funds to wallet

### Notification Slice (`store/slices/notification.slice.js`)

**State:**
- `notifications`: Array of notifications
- `unreadCount`: Count of unread notifications
- `loading`: Loading state
- `error`: Error message

**Actions:**
- `clearNotificationError()`: Clear error state
- `addNotification()`: Add new notification (for real-time updates)

**Async Thunks:**
- `getNotifications`: Fetch all notifications
- `markAsRead`: Mark notification as read

### Category Slice (`store/slices/category.slice.js`)

**State:**
- `categories`: Array of service categories
- `loading`: Loading state
- `error`: Error message

**Actions:**
- `clearCategoryError()`: Clear error state

**Async Thunks:**
- `getCategories`: Fetch all categories

## Usage Examples

### Using Redux in Components

```javascript
"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAuth, useCategories } from '@/store/hooks';
import { signin } from '@/store/api/auth.thunk';
import { getCategories } from '@/store/api/category.thunk';

export default function ExampleComponent() {
  const dispatch = useAppDispatch();
  const { user, loading, error, isAuthenticated } = useAuth();
  const categories = useCategories();

  // Login user
  const handleLogin = async () => {
    const result = await dispatch(signin({ 
      email: 'user@example.com', 
      password: 'password123' 
    }));
  };

  // Fetch categories on mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Creating a Booking

```javascript
"use client";

import { useAppDispatch } from '@/store/hooks';
import { createBooking } from '@/store/api/booking.thunk';

export default function BookingForm() {
  const dispatch = useAppDispatch();

  const handleCreateBooking = async (bookingData) => {
    const result = await dispatch(createBooking({
      providerId: 'provider-id',
      serviceId: 'service-id',
      scheduledAt: new Date(),
      // ... other booking data
    }));
    
    if (createBooking.fulfilled.match(result)) {
      console.log('Booking created:', result.payload);
    }
  };

  return <button onClick={handleCreateBooking}>Create Booking</button>;
}
```

### Finding Nearby Providers

```javascript
"use client";

import { useEffect } from 'react';
import { useAppDispatch, useNearbyProviders } from '@/store/hooks';
import { findNearbyProviders } from '@/store/api/provider.thunk';

export default function ProviderMap() {
  const dispatch = useAppDispatch();
  const nearbyProviders = useNearbyProviders();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      dispatch(findNearbyProviders({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        serviceId: 'service-id',
        radius: 10
      }));
    });
  }, [dispatch]);

  return (
    <div>
      <h2>Nearby Providers</h2>
      {nearbyProviders.map(provider => (
        <div key={provider.id}>{provider.name}</div>
      ))}
    </div>
  );
}
```

### Managing Wallet

```javascript
"use client";

import { useEffect } from 'react';
import { useAppDispatch, useWalletBalance, useTransactions } from '@/store/hooks';
import { getWalletBalance, topUpWallet } from '@/store/api/wallet.thunk';

export default function Wallet() {
  const dispatch = useAppDispatch();
  const balance = useWalletBalance();
  const transactions = useTransactions();

  useEffect(() => {
    dispatch(getWalletBalance());
  }, [dispatch]);

  const handleTopUp = async () => {
    await dispatch(topUpWallet({ amount: 1000 }));
  };

  return (
    <div>
      <h2>Balance: ₹{balance}</h2>
      <button onClick={handleTopUp}>Add ₹1000</button>
    </div>
  );
}
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Best Practices

1. **Always use custom hooks** (`useAuth`, `useBookings`, etc.) instead of `useSelector`
2. **Handle loading and error states** in your components
3. **Use TypeScript** for better type safety (optional)
4. **Dispatch actions on user interactions** and `useEffect` for initial data fetching
5. **Clear errors** after displaying them to the user
6. **Store JWT token** in localStorage (already handled in auth slice)
7. **Use unwrap()** for better error handling:

```javascript
try {
  await dispatch(signin(credentials)).unwrap();
  // Success
} catch (error) {
  // Handle error
  console.error(error);
}
```

## File Structure

```
frontend/
├── store/
│   ├── index.js              # Store configuration
│   ├── provider.js           # Redux Provider wrapper
│   ├── hooks.js              # Custom hooks and selectors
│   ├── slices/
│   │   ├── auth.slice.js
│   │   ├── booking.slice.js
│   │   ├── provider.slice.js
│   │   ├── wallet.slice.js
│   │   ├── notification.slice.js
│   │   └── category.slice.js
│   └── api/
│       ├── auth.thunk.js
│       ├── booking.thunk.js
│       ├── provider.thunk.js
│       ├── wallet.thunk.js
│       ├── notification.thunk.js
│       └── category.thunk.js
```
