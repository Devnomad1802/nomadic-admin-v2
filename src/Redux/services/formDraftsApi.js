import { api } from "../utils";

// Admin form drafts — owner-scoped saved form state (Add/Edit Host, reusable).
const FormDraftsApis = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // List the current admin's drafts, optionally by formType.
    getDrafts: builder.query({
      query: (formType) => ({
        url: formType ? `/form-drafts?formType=${encodeURIComponent(formType)}` : "/form-drafts",
        method: "GET",
      }),
      providesTags: ["formDrafts"],
    }),
    getDraft: builder.query({
      query: (id) => ({ url: `/form-drafts/${id}`, method: "GET" }),
      providesTags: ["formDrafts"],
    }),
    // Upsert the draft for (formType, refId): Save overwrites.
    saveDraft: builder.mutation({
      query: (body) => ({ url: "/form-drafts", method: "POST", body }),
      invalidatesTags: ["formDrafts"],
    }),
    deleteDraft: builder.mutation({
      query: (id) => ({ url: `/form-drafts/${id}`, method: "DELETE" }),
      invalidatesTags: ["formDrafts"],
    }),
  }),
});

export const {
  useGetDraftsQuery,
  useLazyGetDraftsQuery,
  useGetDraftQuery,
  useSaveDraftMutation,
  useDeleteDraftMutation,
} = FormDraftsApis;
