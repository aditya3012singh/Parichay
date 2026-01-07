import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import bookingReducer from "./slices/booking.slice";
import providerReducer from "./slices/provider.slice";
import walletReducer from "./slices/wallet.slice";
import notificationReducer from "./slices/notification.slice";
import categoryReducer from "./slices/category.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    provider: providerReducer,
    wallet: walletReducer,
    notification: notificationReducer,
    category: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});