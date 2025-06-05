// Appointments API
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/appointments",
    prepareHeaders: (headers, { getState }) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Appointment"],
  endpoints: (builder) => ({
    // Get booked times for a specific date
    getBookedTimes: builder.query({
      query: (date) => `/booked/${date}`,
      providesTags: (result, error, date) => [{ type: "Appointment", id: date }],
    }),

    // Create a new appointment
    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: "/",
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Appointment"],
    }),

    // Get user appointments (for future use)
    getUserAppointments: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? [...result.map(({ id }) => ({ type: "Appointment", id })), { type: "Appointment", id: "LIST" }]
          : [{ type: "Appointment", id: "LIST" }],
    }),
  }),
})

export const { useGetBookedTimesQuery, useCreateAppointmentMutation, useGetUserAppointmentsQuery } = appointmentsApi
