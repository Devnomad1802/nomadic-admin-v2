import { api } from "../utils";

// Define a service using a base URL and expected endpoints
const HostsApis = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Host applications ("Become a Host" pipeline)
    getHostApplications: builder.query({
      query: (status) => ({
        url: status ? `/host-portal/applications?status=${status}` : "/host-portal/applications",
        method: "GET",
      }),
      providesTags: ["hostApplications"],
    }),
    updateHostApplication: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/host-portal/applications/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["hostApplications"],
    }),

    // Create Host
    createHost: builder.mutation({
      query: (formDataToSend) => ({
        url: "/host",
        method: "POST",
        body: formDataToSend,
      }),
      invalidatesTags: ["host"],
    }),

    // Get All Hosts
    getAllHosts: builder.query({
      query: () => ({
        url: "/host",
        method: "GET",
      }),
      providesTags: ["host"],
    }),

    // Get Host by ID
    getHostById: builder.query({
      query: (id) => ({
        url: `/host/${id}`,
        method: "GET",
      }),
      providesTags: ["host"],
    }),

    // Update Host
    updateHost: builder.mutation({
      query: ({ id, formDataToSend }) => ({
        url: `/host/${id}`,
        method: "PUT",
        body: formDataToSend,
      }),
      invalidatesTags: ["host"],
    }),

    // Delete Host
    deleteHost: builder.mutation({
      query: (id) => ({
        url: `/host/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["host"],
    }),

    // Activate host: approve + create/link Host-Dashboard login + email credentials
    activateHost: builder.mutation({
      query: (id) => ({
        url: `/host-portal/activate/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["host"],
    }),

    // Update Status
    updateStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/host/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["host"],
    }),

    // Toggle Status
    toggleStatus: builder.mutation({
      query: (id) => ({
        url: `/host/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["host"],
    }),

    // Get Hosts by Specialty
    getHostsBySpecialty: builder.query({
      query: (specialty) => ({
        url: `/host/specialty/${specialty}`,
        method: "GET",
      }),
      providesTags: ["host"],
    }),

    // Get Hosts by Location
    getHostsByLocation: builder.query({
      query: (location) => ({
        url: `/host/location/${location}`,
        method: "GET",
      }),
      providesTags: ["host"],
    }),

    // Get Hosts Statistics
    getHostsStats: builder.query({
      query: () => ({
        url: "/host/stats/overview",
        method: "GET",
      }),
      providesTags: ["host"],
    }),
  }),
});

export const {
  useCreateHostMutation,
  useGetAllHostsQuery,
  useGetHostByIdQuery,
  useUpdateHostMutation,
  useDeleteHostMutation,
  useActivateHostMutation,
  useGetHostApplicationsQuery,
  useUpdateHostApplicationMutation,
  useUpdateStatusMutation,
  useToggleStatusMutation,
  useGetHostsBySpecialtyQuery,
  useGetHostsByLocationQuery,
  useGetHostsStatsQuery,
} = HostsApis;
