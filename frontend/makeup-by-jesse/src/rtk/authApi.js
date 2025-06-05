import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/auth",
    prepareHeaders: (headers, { getState }) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Register new user
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Login user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Get all users (admin only)
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Update user
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }, "User"],
    }),

    // Update user password
    updateUserPassword: builder.mutation({
      query: ({ id, password }) => ({
        url: `/users/${id}/password`,
        method: "PUT",
        body: { password },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // Deactivate user
    deactivateUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }, "User"],
    }),

    // Reactivate user
    reactivateUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/reactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }, "User"],
    }),
  }),
})

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useDeactivateUserMutation,
  useReactivateUserMutation,
} = authApi
