// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import { HeadProvider } from "react-head";
import { store } from "./app/store.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HeadProvider headTags={[]}>
      <CssBaseline />
      <div onContextMenu={(e) => e.preventDefault()}>
        <App /> 
      </div>
      
    </HeadProvider>
  </Provider>
);
