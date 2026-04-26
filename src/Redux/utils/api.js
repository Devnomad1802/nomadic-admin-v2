import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseUrl = "http://localhost:5000/api";
export const baseUrl = "https://api.nomadictownies.com/api";
//  export const baseUrl = "https://d6870f0ebd2d.ngrok-free.app/api";


export const baseImage = "https://api.nomadictownies.com/api";

export const api = createApi({
  reducerPath: "apis",
  tagTypes: [
    "trips",
    "teamMember",
    "user",
    "Blogs",
    "Reviews",
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
