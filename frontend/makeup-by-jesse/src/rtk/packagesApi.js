import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const packagesApi = createApi({
  reducerPath: "packagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
  }),
  tagTypes: ["Packages"],
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: () => "/packages",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Packages", id })), { type: "Packages", id: "LIST" }]
          : [{ type: "Packages", id: "LIST" }],
    }),
    getPackage: builder.query({
      query: (id) => `/packages/${id}`,
      providesTags: (result, error, id) => [{ type: "Packages", id }],
    }),
    addPackage: builder.mutation({
      query: (newPackage) => ({
        url: "/packages",
        method: "POST",
        body: newPackage,
      }),
      invalidatesTags: [{ type: "Packages", id: "LIST" }],
    }),
    updatePackage: builder.mutation({
      query: ({ id, ...packageData }) => ({
        url: `/packages/${id}`,
        method: "PUT",
        body: packageData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Packages", id },
        { type: "Packages", id: "LIST" },
      ],
    }),
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Packages", id: "LIST" }],
    }),
  }),
})

export const {
  useGetPackagesQuery,
  useGetPackageQuery,
  useAddPackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packagesApi
