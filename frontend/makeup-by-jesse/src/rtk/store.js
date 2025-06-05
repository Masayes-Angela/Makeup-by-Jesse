// src/rtk/store.js
import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { serviceApi } from "./serviceApi"
import { packagesApi } from "./packageApi"
import { contactApi } from "./contactApi"
import { authApi } from "./authApi"
import { appointmentsApi } from "./appointmentsApi"

export const store = configureStore({
  reducer: {
    [serviceApi.reducerPath]: serviceApi.reducer,
    [packagesApi.reducerPath]: packagesApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(serviceApi.middleware)
      .concat(packagesApi.middleware)
      .concat(contactApi.middleware)
      .concat(authApi.middleware)
      .concat(appointmentsApi.middleware),
})

setupListeners(store.dispatch)
