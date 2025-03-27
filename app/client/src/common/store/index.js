import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';

// Create and export the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production'
});

// Export the configured store as default
export default store;
