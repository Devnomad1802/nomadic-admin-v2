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
  ],
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
