import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const BannerApis = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    addCoverImage: builder.mutation({
      query: (formDataToSend) => ({
        url: "/addCoverImage",
        method: "POST",
        body: formDataToSend,
      }),
    }),
    getAllBanner: builder.query({
      query: () => ({
        url: "/getCoverImages",
        method: "GET",
      }),
    }),
  }),
});

export const { useAddCoverImageMutation, useGetAllBannerQuery } = BannerApis;
