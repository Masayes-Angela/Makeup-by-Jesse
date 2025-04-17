import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  // Make sure this matches your backend URL
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }), 
  tagTypes: ['Services'],
  endpoints: (builder) => ({
    // Add a service
    addService: builder.mutation({
      query: (newService) => ({
        url: '/services',
        method: 'POST',
        body: newService,
      }),
      invalidatesTags: ['Services'],
    }),
  }),
});

export const { 
  useGetServicesQuery, 
  useAddServiceMutation, 
} = serviceApi;