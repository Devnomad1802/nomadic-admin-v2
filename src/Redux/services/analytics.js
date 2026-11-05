import { api } from "../utils";

const AnalyticsApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAnalyticsOverview: builder.query({
      query: ({ from, to } = {}) => {
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        const qs = params.toString();
        return {
          url: `/analytics/overview${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
    }),
    // ALL bookings for the analytics dashboard (not the paginated 20 the Bookings
    // list uses) — the dashboard must aggregate over the full set.
    getBookingsForAnalytics: builder.query({
      query: () => ({ url: "/getAllBookings?limit=100000", method: "GET" }),
    }),
  }),
});

export const { useGetAnalyticsOverviewQuery, useGetBookingsForAnalyticsQuery } = AnalyticsApi;
