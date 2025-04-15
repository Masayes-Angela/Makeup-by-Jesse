// rtk/serviceApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/' }), // adjust as needed
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (newService) => ({
        url: 'services',
        method: 'POST',
        body: newService,
      }),
    }),
    getServices: builder.query({
      query: () => 'services',
    }),
  }),
});

export const { useAddServiceMutation, useGetServicesQuery } = serviceApi;
