import { api } from "../utils";

// Admin → Host Messages: read-only monitoring of host<->traveller chat.
const HostMessagesApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getHostConversations: builder.query({
      query: ({ page = 1, limit = 20, search = "", flagged = false, hostId = "" } = {}) => {
        const p = new URLSearchParams();
        p.set("page", page);
        p.set("limit", limit);
        if (search) p.set("search", search);
        if (flagged) p.set("flagged", "true");
        if (hostId) p.set("hostId", hostId);
        return { url: `/host-chat/admin/conversations?${p.toString()}`, method: "GET" };
      },
    }),
    getHostConversation: builder.query({
      query: (id) => ({ url: `/host-chat/admin/conversations/${id}`, method: "GET" }),
    }),
  }),
});

export const {
  useGetHostConversationsQuery,
  useLazyGetHostConversationQuery,
} = HostMessagesApi;
