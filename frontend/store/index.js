import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import bookingReducer from "./slices/booking.slice";
import providerReducer from "./slices/provider.slice";
import walletReducer from "./slices/wallet.slice";
import notificationReducer from "./slices/notification.slice";
import categoryReducer from "./slices/category.slice";
import reviewReducer from "./slices/review.slice";
import messageReducer from "./slices/message.slice";
import availabilityReducer from "./slices/availability.slice";
import couponReducer from "./slices/coupon.slice";
import fileReducer from "./slices/file.slice";
import matchReducer from "./slices/match.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    provider: providerReducer,
    wallet: walletReducer,
    notification: notificationReducer,
    category: categoryReducer,
    review: reviewReducer,
    message: messageReducer,
    availability: availabilityReducer,
    coupon: couponReducer,
    file: fileReducer,
    match: matchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});