import { useDispatch, useSelector } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Auth Selectors
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.auth.user);
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);

// Booking Selectors
export const useBookings = () => useAppSelector((state) => state.booking.bookings);
export const useJobs = () => useAppSelector((state) => state.booking.jobs);
export const useCurrentBooking = () => useAppSelector((state) => state.booking.currentBooking);

// Provider Selectors
export const useProviderProfile = () => useAppSelector((state) => state.provider.profile);
export const useProviders = () => useAppSelector((state) => state.provider.providers);
export const useNearbyProviders = () => useAppSelector((state) => state.provider.nearbyProviders);

// Wallet Selectors
export const useWalletBalance = () => useAppSelector((state) => state.wallet.balance);
export const useTransactions = () => useAppSelector((state) => state.wallet.transactions);

// Notification Selectors
export const useNotifications = () => useAppSelector((state) => state.notification.notifications);
export const useUnreadCount = () => useAppSelector((state) => state.notification.unreadCount);

// Category Selectors
export const useCategories = () => useAppSelector((state) => state.category.categories);
