import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import { api } from "./api";
import { globalSlice } from "../slices";
import { userSlice } from "../slices";

// Configure Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["global", "users"], // Specify the reducers you want to persist
};

// Combine reducers
const rootReducer = combineReducers({
  global: globalSlice.reducer,
  users: userSlice.reducer,
  [api.reducerPath]: api.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Setup listeners
setupListeners(store.dispatch);

// Export persistor for later use (optional)
export const persistor = persistStore(store);

// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
// import storage from "redux-persist/lib/storage";
// import { persistReducer } from "redux-persist";
// import { combineReducers } from "redux";
// import { globalSlice } from "../slices";
// import { api } from "./api";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const reducer = combineReducers({
//   global: globalSlice,
// });

// const persistedReducer = persistReducer(persistConfig, reducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(api.middleware), // Use api.middleware
// });

// setupListeners(store.dispatch);
