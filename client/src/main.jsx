// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.jsx";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { HeadProvider } from "react-head";
import { store } from "./app/store.js";
import { Provider } from "react-redux";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HeadProvider headTags={[]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div onContextMenu={(e) => e.preventDefault()}>
          <App />
        </div>
      </ThemeProvider>
    </HeadProvider>
  </Provider>
);
