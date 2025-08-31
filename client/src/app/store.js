import { configureStore } from "@reduxjs/toolkit";
import authReducers from "../features/authSlice/authSlice.js";
import api from "./api.js";
import misc from "../features/misc/misc.js";
import chatSlice from "../features/chat/chat.js";
export const store = configureStore({
  reducer: {
    auth: authReducers,
    misc: misc,
    chat: chatSlice,
    [api.reducerPath]: api.reducer,
    // Add your reducers here.
  },
  middleware: (mid) => [...mid(), api.middleware],
});
