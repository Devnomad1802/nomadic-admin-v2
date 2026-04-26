import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const CoupenApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // ---------- Add Copun ------------
    addCoupon: builder.mutation({
      query: ({
        Select_Coupon_type,
        Coupon_Title,
        Description,
        Coupon_Name,
        Coupon_percentage,
      }) => ({
        url: "/addCoupon",
        method: "POST",
        body: {
          Select_Coupon_type,
          Coupon_Title,
          Description,
          Coupon_Name,
          Coupon_percentage,
        },
      }),
      invalidatesTags: ["Coupons"],
    }),

    // ---------------- Update Copuns --------------------
    updateCoupon: builder.mutation({
      query: ({
        Select_Coupon_type,
        Coupon_Title,
        Description,
        Coupon_Name,
        Coupon_percentage,
        _id,
      }) => ({
        url: "/updateCoupon",
        method: "POST",
        body: {
          Select_Coupon_type,
          Coupon_Title,
          Description,
          Coupon_Name,
          Coupon_percentage,
          _id,
        },
      }),
      invalidatesTags: ["Coupons"],
    }),

    // --------------- Delete Copun ----------------
    deleteCoupon: builder.mutation({
      query: ({ _id }) => ({
        url: "/deleteCoupon",
        method: "DELETE",
        body: { _id },
      }),
      invalidatesTags: ["Coupons"],
    }),

    // ------------- Get All Copuns  ---------------
    getAllCoupon: builder.query({
      query: () => ({
        url: "/getAllCoupon",
        method: "GET",
      }),
      providesTags: ["Coupons"],
    }),
  }),
});

export const {
  useAddCouponMutation,
  useGetAllCouponQuery,
  useDeleteCouponMutation,
  useUpdateCouponMutation,
} = CoupenApi;
