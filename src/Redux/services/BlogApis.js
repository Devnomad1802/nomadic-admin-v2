import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const BlogApis = api.injectEndpoints({
  overrideExisting: false,
  // ------------ Add Blogs -----------------
  endpoints: (builder) => ({
    addBlog: builder.mutation({
      query: (formDataToSend) => ({
        url: "/addBlog",
        method: "POST",
        body: formDataToSend,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // ---------- Update ---------------

    updateBlog: builder.mutation({
      query: (formDataToSend) => ({
        url: "/updateBlog",
        method: "POST",
        body: formDataToSend,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // ---------------- Get All Bloges -----------
    getAllBlogs: builder.query({
      query: () => ({
        url: "/getAllBlogs",
        method: "GET",
      }),
      providesTags: ["Blogs"],
    }),

    // --------------- Delete Bolgs ------------
    deleteBlog: builder.mutation({
      query: ({ _id }) => ({
        url: "/deleteBlog",
        method: "DELETE",
        body: { _id },
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useAddBlogMutation,
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} = BlogApis;
