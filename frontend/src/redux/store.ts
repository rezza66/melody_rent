import { configureStore, combineReducers } from "@reduxjs/toolkit";
import instrumentReducer from "./instrumentSlice";
import authReducer from "./authSlice";
import userReducer from "./userSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Menggunakan localStorage

// Konfigurasi persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Hanya auth yang akan dipersist
};

// Gabungkan reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  instrument: instrumentReducer,
});

// Bungkus rootReducer dengan persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Buat persistor
export const persistor = persistStore(store);

// Tipe untuk RootState dan AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
