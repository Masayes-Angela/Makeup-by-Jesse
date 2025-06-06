import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

import { setupListeners } from '@reduxjs/toolkit/query';
import { serviceApi } from './serviceApi';
import { packagesApi } from './packageApi';
import { contactApi } from './contactApi';
import { authApi } from './authApi';
import { appointmentsApi } from './appointmentsApi';
import authReducer from './authSlice';

// 👇 combine all reducers including the auth slice
const rootReducer = combineReducers({
  [serviceApi.reducerPath]: serviceApi.reducer,
  [packagesApi.reducerPath]: packagesApi.reducer,
  [contactApi.reducerPath]: contactApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [appointmentsApi.reducerPath]: appointmentsApi.reducer,
  auth: authReducer,
});

// 👇 persist only the auth slice
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 👇 configure store with persisted reducer and serializable checks
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(serviceApi.middleware)
      .concat(packagesApi.middleware)
      .concat(contactApi.middleware)
      .concat(authApi.middleware)
      .concat(appointmentsApi.middleware),
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);