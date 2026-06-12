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
  }),
});

export const { useGetAnalyticsOverviewQuery } = AnalyticsApi;
