import { api } from "../utils";

// Admin Payment Maintenance settings — reads/writes the server singleton.
const PaymentSettingsApis = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getPaymentSettings: builder.query({
      query: () => ({ url: "/admin/payment-settings", method: "GET" }),
      providesTags: ["paymentSettings"],
    }),
    updatePaymentSettings: builder.mutation({
      query: (body) => ({ url: "/admin/payment-settings", method: "PUT", body }),
      invalidatesTags: ["paymentSettings"],
    }),
  }),
});

export const {
  useGetPaymentSettingsQuery,
  useUpdatePaymentSettingsMutation,
} = PaymentSettingsApis;
