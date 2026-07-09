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
      query: ({ Name, Title, Review, rating, Job, _id, source, location, tripName }) => ({
        url: "/updateReview",
        method: "POST",
        body: { Name, Title, Review, rating, Job, _id, source, location, tripName },
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

    // ---------------- Host reviews (entity-scoped, never brand) ----------------
    getReviewsByHostId: builder.query({
      query: (hostId) => ({
        url: `/getAllReviewsByHostId/${hostId}`,
        method: "GET",
      }),
      providesTags: ["HostReviews"],
    }),

    addHostReview: builder.mutation({
      query: (body) => ({
        url: "/addUserReview",
        method: "POST",
        body, // { hostId, name, rating, review, location, tripName, profileImage, source }
      }),
      invalidatesTags: ["HostReviews"],
    }),

    deleteHostReview: builder.mutation({
      query: (id) => ({
        url: `/deleteUserReview/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HostReviews"],
    }),
  }),
});

export const {
  useAddReviewMutation,
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
  useGetReviewsByHostIdQuery,
  useAddHostReviewMutation,
  useDeleteHostReviewMutation,
} = ReviewApi;
