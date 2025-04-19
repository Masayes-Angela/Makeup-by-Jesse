import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    // Get all services
    getServices: builder.query({
      query: () => "/services",
      providesTags: ["Services"],
    }),

    // Get a single service
    getService: builder.query({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Services", id }],
    }),

    // Add a service
    addService: builder.mutation({
      query: (newService) => ({
        url: "/services",
        method: "POST",
        body: newService,
      }),
      invalidatesTags: ["Services"],
    }),

    // Update a service
    updateService: builder.mutation({
      query: ({ id, ...service }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body: service,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Services", id }],
    }),

    // Delete a service (if you want to add this functionality later)
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi
