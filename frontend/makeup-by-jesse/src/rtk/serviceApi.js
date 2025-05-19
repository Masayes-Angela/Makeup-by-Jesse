import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
  }),
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    // Get all services
    getServices: builder.query({
      query: () => "/services",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Services", id })), { type: "Services", id: "LIST" }]
          : [{ type: "Services", id: "LIST" }],
    }),

    // Get a single service
    getService: builder.query({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Services", id }],
    }),

    // Add a service
    addService: builder.mutation({
      query: (serviceData) => ({
        url: "/services",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: [{ type: "Services", id: "LIST" }],
    }),

    // Update a service
    updateService: builder.mutation({
      query: ({ id, ...serviceData }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body: serviceData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Services", id },
        { type: "Services", id: "LIST" },
      ],
    }),

    // Delete a service (deactivate)
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Services", id: "LIST" }],
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
