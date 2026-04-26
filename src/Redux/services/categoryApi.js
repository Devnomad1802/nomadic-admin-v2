import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const CategoryApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (formDataToSend) => ({
        url: "/addCategories",
        method: "POST",
        body: formDataToSend,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: (formDataToSend) => ({
        url: "/updateCategory",
        method: "PUT",
        body: formDataToSend,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (_id) => ({
        url: "/deleteCategories",
        method: "DELETE",
        body: _id,
      }),
      invalidatesTags: ["Categories"],
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: "/getAllCategories",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = CategoryApi;
