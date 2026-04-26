import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const SeoApi = api.injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
        addSeo: builder.mutation({
            query: (formDataToSend) => ({
                url: "/add-seo",
                method: "POST",
                body: formDataToSend,
            }),
            invalidatesTags: ["Seo"],
        }),

        updateSeo: builder.mutation({
            query: ({ _id, ...formDataToSend }) => ({
                url: `/update-seo/${_id}`,
                method: "PUT",
                body: formDataToSend,
            }),
            invalidatesTags: ["Seo"],
        }),
        getSeo: builder.query({
            query: () => ({
                url: "/get-seo",
                method: "GET",
            }),
            providesTags: ["Seo"],
        }),
        getAllSeo: builder.query({
            query: () => ({
                url: "/get-all-seo",
                method: "GET",
            }),
            providesTags: ["Seo"],
        }),
    }),
});

export const {
    useAddSeoMutation,
    useUpdateSeoMutation,
    useGetSeoQuery,
    useGetAllSeoQuery,
} = SeoApi;
