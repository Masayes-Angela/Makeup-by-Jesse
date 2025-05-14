// src/rtk/store.js
import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { serviceApi } from "./serviceApi"
import { packagesApi } from "./packagesApi"

export const store = configureStore({
  reducer: {
    [serviceApi.reducerPath]: serviceApi.reducer,
    [packagesApi.reducerPath]: packagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(serviceApi.middleware).concat(packagesApi.middleware),
})

setupListeners(store.dispatch)
