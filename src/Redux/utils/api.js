import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Dynamic URL selection: Prioritizes Vercel Env Vars, falls back to new Production IP
export const baseUrl = import.meta.env.VITE_API_URL || "http://168.144.119.114:5000/api";

// For images, we use the root IP so the frontend can append the file paths correctly
export const baseImage = import.meta.env.VITE_IMAGE_URL || "http://168.144.119.114:5000";

export const api = createApi({
  reducerPath: "apis",
  tagTypes: [
    "trips",
    "teamMember",
    "user",
    "Blogs",
    "Reviews",
    "HostReviews",
    "Coupons",
    "venders",
    "hosts",
    "payout",
    "hostApplications",
  ],
  baseQuery: async (args, apiCtx, extraOptions) => {
    const raw = fetchBaseQuery({
      baseUrl,
      prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
          // Server (passport-jwt) expects "Bearer <jwt>"; stored tokens
          // already include the prefix, but normalise defensively.
          headers.set("Authorization", token.startsWith("Bearer ") ? token : `Bearer ${token}`);
        }
        return headers;
      },
    });
    const result = await raw(args, apiCtx, extraOptions);
    // Expired/invalid JWT: writes fail silently otherwise. Clear the stale
    // token and send the admin back to login instead of dead-ending forms.
    if (result?.error?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return result;
  },
  endpoints: () => ({}),
});
