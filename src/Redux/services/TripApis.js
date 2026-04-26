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
  useDeleteTripsMutation,
} = TripApis;
