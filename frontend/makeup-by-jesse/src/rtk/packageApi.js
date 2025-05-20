import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const packagesApi = createApi({
  reducerPath: "packagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
  }),
  tagTypes: ["Packages"],
  endpoints: (builder) => ({
    // Get all packages
    getPackages: builder.query({
      query: () => "/packages",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Packages", id })), { type: "Packages", id: "LIST" }]
          : [{ type: "Packages", id: "LIST" }],
      transformResponse: (response) => {
        // Ensure all packages have the required fields
        return response.map((pkg) => ({
          ...pkg,
          // Ensure price is a number
          price: typeof pkg.price === "string" ? Number.parseFloat(pkg.price) : pkg.price,
          // Ensure image_url exists
          image_url: pkg.image_url || null,
        }))
      },
    }),

    // Get a single package
    getPackage: builder.query({
      query: (id) => `/packages/${id}`,
      providesTags: (result, error, id) => [{ type: "Packages", id }],
    }),

    // Add a package
    addPackage: builder.mutation({
      query: (packageData) => ({
        url: "/packages",
        method: "POST",
        body: packageData,
      }),
      invalidatesTags: [{ type: "Packages", id: "LIST" }],
    }),

    // Update a package
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

    // Delete a package (deactivate)
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Packages", id: "LIST" }],
    }),

    // Deactivate a package
    deactivatePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/deactivate/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Packages", id },
        { type: "Packages", id: "LIST" },
      ],
    }),

    // Reactivate a package
    reactivatePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/restore/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Packages", id },
        { type: "Packages", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetPackagesQuery,
  useGetPackageQuery,
  useAddPackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useDeactivatePackageMutation,
  useReactivatePackageMutation,
} = packagesApi
