import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const BookingApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAllBooking: builder.query({
      // Server-driven pagination + search + status. POST carries status in the
      // body; page/limit/search go in the query string.
      query: ({ page = 1, limit = 20, search = "", status = "All" } = {}) => {
        const p = new URLSearchParams();
        p.set("page", page);
        p.set("limit", limit);
        if (search) p.set("search", search);
        return {
          url: `/getAllBookings?${p.toString()}`,
          method: "POST",
          body: { status },
        };
      },
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
