import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const TripApis = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    addTrip: builder.mutation({
      query: (formDataToSend) => ({
        url: "/addTrip",
        method: "POST",
        body: formDataToSend,
      }),
      invalidatesTags: ["trips"],
    }),
    updateTrip: builder.mutation({
      query: (data) => ({
        url: "/updateTrip",
        method: "POST",
        body: data,
        // Don't set Content-Type header - let browser set it automatically for FormData
      }),
      invalidatesTags: ["trips"],
    }),
    // Approve / reject / request-changes on host trip proposals.
    updateTripStatus: builder.mutation({
      query: ({ tripId, Status, adminFeedback }) => ({
        url: "/updateTripStatus",
        method: "POST",
        body: { tripId, Status, adminFeedback },
      }),
      invalidatesTags: ["trips"],
    }),

    // Toggle public website visibility (admin). Hides/shows a trip on all
    // public surfaces without touching its content, status or bookings.
    updateTripVisibility: builder.mutation({
      query: ({ tripId, showOnWebsite }) => ({
        url: "/updateTripVisibility",
        method: "POST",
        body: { tripId, showOnWebsite },
      }),
      invalidatesTags: ["trips"],
    }),

    getBookingsByTripId: builder.mutation({
      query: ({ tripId }) => ({
        url: "/getBookingsByTripId",
        method: "POST",
        body: { tripId },
      }),
    }),
    getTrips: builder.query({
      query: () => ({
        url: "/GetAllTrips",
        method: "GET",
      }),
      providesTags: ["trips"],
    }),

    deleteTrips: builder.mutation({
      query: (_id) => ({
        url: "/deleteTrips",
        method: "POST",
        body: _id,
      }),
      invalidatesTags: ["trips"],
    }),
  }),
});

export const {
  useAddTripMutation,
  useGetTripsQuery,
  useGetBookingsByTripIdMutation,
  useUpdateTripMutation,
  useUpdateTripStatusMutation,
  useUpdateTripVisibilityMutation,
  useDeleteTripsMutation,
} = TripApis;
