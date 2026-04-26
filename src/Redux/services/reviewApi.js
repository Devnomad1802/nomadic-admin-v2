import { api } from "../utils";

// Define a service using a base URL and expected endpoints ....

const ReviewApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: (formDataToSend) => ({
        url: "/addReview",
        method: "POST",
        body: formDataToSend,
      }),
      invalidatesTags: ["Reviews"],
    }),

    // --------- update Rewies ------------
    updateReview: builder.mutation({
      query: ({ Name, Title, Review, rating, Job, _id }) => ({
        url: "/updateReview",
        method: "POST",
        body: { Name, Title, Review, rating, Job, _id },
      }),
      invalidatesTags: ["Reviews"],
    }),
    getAllReviews: builder.query({
      query: () => ({
        url: "/getAllReviews",
        method: "GET",
      }),
      providesTags: ["Reviews"],
    }),

    deleteReview: builder.mutation({
      query: ({ _id }) => ({
        url: "/deleteReview",
        method: "DELETE",
        body: { _id },
      }),
      invalidatesTags: ["Reviews"],
    }),



  }),
});

export const {
  useAddReviewMutation,
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation,

} = ReviewApi;
