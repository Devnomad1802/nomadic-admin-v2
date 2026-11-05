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
      // POST with status:"All" so the controller returns every booking (its GET/
      // no-body path falls into a status-filtered branch and returns a subset).
      query: () => ({
        url: "/getAllBookings?limit=100000",
        method: "POST",
        body: { status: "All" },
      }),
    }),
  }),
});

export const { useGetAnalyticsOverviewQuery, useGetBookingsForAnalyticsQuery } = AnalyticsApi;
