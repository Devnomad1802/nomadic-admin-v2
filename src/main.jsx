import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Box } from "@mui/material";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.js";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

import { store } from "./Redux/utils";
import Loading from "./smallComponents/Loading.jsx";
let persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>

  <BrowserRouter>
    <ReduxProvider store={store}>
      <PersistGate loading={<Loading isLoading={true} />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <Box>
            <CssBaseline />
            <App />
          </Box>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  </BrowserRouter>

  // </React.StrictMode>
);
