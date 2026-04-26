import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const EnquireApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAllEnquries: builder.query({
      query: ({ range }) => ({
        url: `/getAllEnquries?range=${range}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllEnquriesQuery } = EnquireApi;
