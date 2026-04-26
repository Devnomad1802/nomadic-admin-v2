import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const VanderApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    addVendor: builder.mutation({
      query: ({
        First_Name,
        Location,
        Last_Name,
        Email,
        Mobile_1,
        Mobile_2,
        Remarks,
      }) => ({
        url: "/addVendor",
        method: "POST",
        body: {
          First_Name,
          Location,
          Last_Name,
          Email,
          Mobile_1,
          Mobile_2,
          Remarks,
        },
      }),
      invalidatesTags: ["venders"],
    }),

    // ------------ Update Vender -------------
    updateVendor: builder.mutation({
      query: ({
        First_Name,
        Location,
        Last_Name,
        Email,
        Mobile_1,
        Mobile_2,
        Remarks,
        _id,
      }) => ({
        url: "/updateVendor",
        method: "POST",
        body: {
          First_Name,
          Location,
          Last_Name,
          Email,
          Mobile_1,
          Mobile_2,
          Remarks,
          _id,
        },
      }),
      invalidatesTags: ["venders"],
    }),

    // ------------ Delete Vender --------------
    deleteVendor: builder.mutation({
      query: (_id) => ({
        url: "/deleteVendor",
        method: "POST",
        body: _id,
      }),
      invalidatesTags: ["venders"],
    }),
    GetAllVendors: builder.query({
      query: () => ({
        url: "/GetAllVendors",
        method: "GET",
      }),
      providesTags: ["venders"],
    }),
  }),
});

export const {
  useAddVendorMutation,
  useGetAllVendorsQuery,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = VanderApi;
