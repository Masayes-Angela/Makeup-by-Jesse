import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  // Make sure this matches your backend URL
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }), 
  tagTypes: ['Services'],
  endpoints: (builder) => ({
    // Get all services
    getServices: builder.query({
      query: () => '/services',
      providesTags: ['Services'],
    }),
    // Add a service
    addService: builder.mutation({
      query: (newService) => ({
        url: '/services',
        method: 'POST',
        body: newService,
      }),
      invalidatesTags: ['Services'],
    }),
    // Update a service
    updateService: builder.mutation({
      query: ({ id, ...service }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body: service,
      }),
      invalidatesTags: ['Services'],
    }),
    // Delete a service
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services'],
    }),
  }),
});

export const { 
  useGetServicesQuery, 
  useAddServiceMutation, 
  useUpdateServiceMutation,
  useDeleteServiceMutation
} = serviceApi;