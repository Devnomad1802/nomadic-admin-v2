import { api } from "../utils";

// Admin-only assisted bookings via Razorpay payment links (server §3/§4).
//   link   → create/regenerate a server-priced payment link
//   cancel → cancel the active link (only while unpaid)
//   status → authoritative poll (also finalises a paid-but-unwebhooked booking)
const assistedBookingApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    createAssistedLink: builder.mutation({
      query: (body) => ({ url: "/admin/assisted-booking/link", method: "POST", body }),
    }),
    cancelAssistedLink: builder.mutation({
      query: (body) => ({ url: "/admin/assisted-booking/cancel", method: "POST", body }),
    }),
    getAssistedLinkStatus: builder.mutation({
      query: (bookingId) => ({ url: `/admin/assisted-booking/status/${bookingId}`, method: "GET" }),
    }),
  }),
});

export const {
  useCreateAssistedLinkMutation,
  useCancelAssistedLinkMutation,
  useGetAssistedLinkStatusMutation,
} = assistedBookingApi;
