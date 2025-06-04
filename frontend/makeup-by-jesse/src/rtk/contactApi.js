import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api",
  }),
  tagTypes: ["Contact"],
  endpoints: (builder) => ({
    // Get contact info
    getContactInfo: builder.query({
      query: () => "/contact",
      providesTags: ["Contact"],
    }),

    // Add contact info
    addContactInfo: builder.mutation({
      query: (contactData) => ({
        url: "/contact",
        method: "POST",
        body: contactData,
      }),
      invalidatesTags: ["Contact"],
    }),

    // Update contact info
    updateContactInfo: builder.mutation({
      query: (contactData) => ({
        url: "/contact",
        method: "PUT",
        body: contactData,
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
})

export const { useGetContactInfoQuery, useAddContactInfoMutation, useUpdateContactInfoMutation } = contactApi
