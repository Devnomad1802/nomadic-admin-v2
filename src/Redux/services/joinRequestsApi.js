import { api } from "../utils";

/* Admin oversight of host-approval Join Requests. Read-only list + audited
 * override revoke. Fully additive — no existing endpoint touched. */
const JoinRequestsApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAdminJoinRequests: builder.query({
      query: (params = {}) => {
        const q = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "" && v !== null) q.set(k, v);
        });
        const qs = q.toString();
        return { url: `/admin/join-requests${qs ? `?${qs}` : ""}`, method: "GET" };
      },
      providesTags: ["joinRequests"],
    }),
    adminRevokeJoinRequest: builder.mutation({
      query: ({ id, note }) => ({
        url: `/admin/join-requests/${id}/revoke`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: ["joinRequests"],
    }),
  }),
});

export const { useGetAdminJoinRequestsQuery, useAdminRevokeJoinRequestMutation } = JoinRequestsApi;
export default JoinRequestsApi;
