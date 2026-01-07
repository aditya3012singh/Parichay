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

// Review Selectors
export const useReviews = () => useAppSelector((state) => state.review.reviews);
export const useProviderReviews = () => useAppSelector((state) => state.review.providerReviews);
export const useMyReviews = () => useAppSelector((state) => state.review.myReviews);

// Message Selectors
export const useMessages = () => useAppSelector((state) => state.message.conversations);
export const useCurrentConversation = () => useAppSelector((state) => state.message.currentConversation);
export const useAllConversations = () => useAppSelector((state) => state.message.allConversations);

// Availability Selectors
export const useAvailabilitySlots = () => useAppSelector((state) => state.availability.slots);
export const useProviderSlots = () => useAppSelector((state) => state.availability.providerSlots);

// Coupon Selectors
export const useCoupons = () => useAppSelector((state) => state.coupon.coupons);
export const useCouponValidation = () => useAppSelector((state) => state.coupon.validationResult);

// File Selectors
export const useUserFiles = () => useAppSelector((state) => state.file.userFiles);
export const useUploadedFile = () => useAppSelector((state) => state.file.uploadedFile);

// Match Selectors
export const useNearbyMatchProviders = () => useAppSelector((state) => state.match.nearbyProviders);
export const useSearchResults = () => useAppSelector((state) => state.match.searchResults);
export const useProviderDetails = () => useAppSelector((state) => state.match.providerDetails);

// Global Loading Selector
export const useLoading = () => useAppSelector((state) => {
  return {
    auth: state.auth.loading,
    booking: state.booking.loading,
    provider: state.provider.loading,
    wallet: state.wallet.loading,
    notification: state.notification.loading,
    category: state.category.loading,
    review: state.review.loading,
    message: state.message.loading,
    availability: state.availability.loading,
    coupon: state.coupon.loading,
    file: state.file.loading,
    match: state.match.loading,
  };
});

// Global Error Selector
export const useError = () => useAppSelector((state) => {
  return {
    auth: state.auth.error,
    booking: state.booking.error,
    provider: state.provider.error,
    wallet: state.wallet.error,
    notification: state.notification.error,
    category: state.category.error,
    review: state.review.error,
    message: state.message.error,
    availability: state.availability.error,
    coupon: state.coupon.error,
    file: state.file.error,
    match: state.match.error,
  };
});
