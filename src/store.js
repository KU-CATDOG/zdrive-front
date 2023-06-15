import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/loginSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
