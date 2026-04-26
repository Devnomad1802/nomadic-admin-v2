import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const AboutApis = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    addTeamMember: builder.mutation({
      query: (formDataToSend) => ({
        url: "/addTeamMember",
        method: "POST",
        body: formDataToSend,
      }),
      invalidatesTags: ["teamMember"],
    }),

    deleteTeamMember: builder.mutation({
      query: ({ _id }) => ({
        url: "/deleteTeamMember",
        method: "DELETE",
        body: { _id },
      }),
      invalidatesTags: ["teamMember"],
    }),

    getTeamMembers: builder.query({
      query: () => ({
        url: "/getAllTeamMember",
        method: "GET",
      }),
      providesTags: ["teamMember"],
    }),

    updateTeamMember: builder.mutation({
      query: (formDataToSend) => ({
        url: "/updateTeamMember",
        method: "POST",
        body: formDataToSend,
      }),
      invalidatesTags: ["teamMember"],
    }),
  }),
});

export const {
  useAddTeamMemberMutation,
  useGetTeamMembersQuery,
  useDeleteTeamMemberMutation,
  useUpdateTeamMemberMutation,
} = AboutApis;
