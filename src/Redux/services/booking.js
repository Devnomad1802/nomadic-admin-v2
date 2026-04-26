import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const BookingApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAllBooking: builder.query({
      query: () => ({
        url: "/getAllBookings",
        method: "GET",
      }),
    }),
    getUserBooking: builder.mutation({
      query: ({ userId }) => ({
        url: "/getUserBooking",
        method: "POST",
        body: { userId },
      }),
    }),
  }),
});

export const { useGetAllBookingQuery, useGetUserBookingMutation } = BookingApi;
