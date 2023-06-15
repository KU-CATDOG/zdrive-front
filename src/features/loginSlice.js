import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "logined",
  initialState: {
    studentNumber: "",
    logined: false,
  },
  reducers: {
    login: (state, action) => {
      state.studentNumber = action.payload;
      state.logined = true;
    },
    logout: (state) => {
      state.studentNumber = "";
      state.logined = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
