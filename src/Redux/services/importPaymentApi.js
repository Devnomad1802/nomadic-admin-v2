import { api } from "../utils";

// Admin-only Import Existing Payment (server directive §5).
//   preview  → read-only authoritative evidence (masked) + expected-vs-received
//   confirm  → create an "imported" booking + finalize once (no new charge)
// Both go through the shared `api` baseQuery, which attaches the admin Bearer
// token and bounces to /login on a 401.
const importPaymentApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    previewImportPayment: builder.mutation({
      query: (body) => ({
        url: "/admin/import-payment/preview",
        method: "POST",
        body,
      }),
    }),
    confirmImportPayment: builder.mutation({
      query: (body) => ({
        url: "/admin/import-payment/confirm",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  usePreviewImportPaymentMutation,
  useConfirmImportPaymentMutation,
} = importPaymentApi;
