import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeMode: "dark",
  userDbData: null,
  isAuthenticated: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.themeMode = action.payload;
    },
    setGlobalUserData: (state, { payload }) => {
      state.userDbData = payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { changeTheme, setGlobalUserData, setAuthenticated } =
  globalSlice.actions;

export const selectCurrentUser = (state) => state.global.userDbData;
export const selectIsAuthenticated = (state) => state.global.isAuthenticated;
