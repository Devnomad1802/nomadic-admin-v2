// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    isLoggedIn: false,
    userData: null,
  },
  reducers: {
    setUsers: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setUserDbData: (state, action) => {
      state.userData = action.payload;
      state.isLoggedIn = true;
      state.error = null;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      state.error = null;
    },
  },
});

export const { setUsers, setLoading, setError, setUserDbData, logout } = userSlice.actions;
