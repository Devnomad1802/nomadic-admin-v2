import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const PayoutApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getPayout: builder.query({
      query: () => ({
        url: "/getFullPaymentBookings",
        method: "GET",
      }),
      invalidatesTags: ["payout"],
    }),
    processPayout: builder.mutation({
      query: ({ bookingId }) => ({
        url: `/razorpay`,
        method: "POST",
        body: { bookingId },
      }),
      invalidatesTags: ["payout"],
    }),
    retryPayout: builder.mutation({
      query: (payoutId) => ({
        url: `/retryPayout/${payoutId}`,
        method: "POST",
      }),
      invalidatesTags: ["payout"],
    }),
  }),
});

export const {
  useGetPayoutQuery,
  useProcessPayoutMutation,
  useRetryPayoutMutation,
} = PayoutApi;
