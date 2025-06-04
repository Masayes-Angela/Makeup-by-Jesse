// src/rtk/store.js
import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { serviceApi } from "./serviceApi"
import { packagesApi } from "./packageApi"
import { contactApi } from "./contactApi"

export const store = configureStore({
  reducer: {
    [serviceApi.reducerPath]: serviceApi.reducer,
    [packagesApi.reducerPath]: packagesApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(serviceApi.middleware).concat(packagesApi.middleware).concat(contactApi.middleware),
})

setupListeners(store.dispatch)
