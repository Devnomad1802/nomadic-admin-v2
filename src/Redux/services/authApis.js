import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const authApis = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: ({ name, email, phone, password }) => ({
        url: "/auth/register",
        method: "POST",
        body: { name, email, phone, password, role: "Admin" },
      }),
    }),

    sendSmsCode: builder.mutation({
      query: ({ number }) => ({
        url: "/auth/sendSmsCode",
        method: "POST",
        body: { number },
      }),
    }),
    verifySmsCode: builder.mutation({
      query: ({ number, result }) => ({
        url: "/auth/verifySmsCode",
        method: "POST",
        body: { code: result, number },
      }),
    }),

    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: "/auth/users",
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    sendMailConfirmation: builder.mutation({
      query: () => ({
        url: "/auth/sendMail",
        method: "POST",
        body: {},
      }),
    }),
    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        url: "/auth/deleteUser",
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["user"],
    }),
    resetPass: builder.mutation({
      query: (email) => ({
        url: `/auth/forgotPassword/${email}`,
        method: "GET",
      }),
    }),
    changePass: builder.mutation({
      query: ({ token, password }) => ({
        url: "/auth/changepassword",
        method: "POST",
        body: { token, password },
      }),
    }),
    influencer: builder.mutation({
      query: ({ name, email, phone, gender, influencer, userId }) => ({
        url: "/auth/editinfluencer",
        method: "POST",
        body: { name, email, phone, gender, influencer, userId },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useResetPassMutation,
  useDeleteUserMutation,
  useLoginUserMutation,
  useSendMailConfirmationMutation,
  useVerifySmsCodeMutation,
  useInfluencerMutation,
  useGetUsersQuery,
  usePrefetch,
  useChangePassMutation,
  useSendSmsCodeMutation,
} = authApis;
