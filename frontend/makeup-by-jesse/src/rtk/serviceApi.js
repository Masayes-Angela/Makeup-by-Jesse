import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    // Add additional logging for debugging
    prepareHeaders: (headers, { getState, endpoint, type, url }) => {
      console.log(`Making ${type} request to ${url}`)
      return headers
    },
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
      // Add transform response for debugging
      transformResponse: (response) => {
        console.log("getServices response:", response)
        return response
      },
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
      invalidatesTags: [{ type: "Services", id: "LIST" }],
    }),

    // Update a service
    updateService: builder.mutation({
      query: ({ id, ...service }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body: service,
      }),
      // Invalidate both the specific service and the list
      invalidatesTags: (result, error, { id }) => [
        { type: "Services", id },
        { type: "Services", id: "LIST" },
      ],
    }),

    // Delete a service
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      // Add transform response for debugging
      transformResponse: (response, meta, arg) => {
        console.log(`Delete service response for ID ${arg}:`, response)
        return response
      },
      // Add transform error response for debugging
      transformErrorResponse: (response, meta, arg) => {
        console.error(`Error deleting service ID ${arg}:`, response)
        return response
      },
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
