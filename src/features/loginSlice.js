import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "logined",
  initialState: {
    studentNumber: "",
    userId: -1,
    logined: false,
  },
  reducers: {
    login: (state, action) => {
      state.studentNumber = action.payload?.studentNumber ?? "";
      state.userId = action.payload?.userId ?? -1;
      state.logined = true;
    },
    logout: (state) => {
      state.studentNumber = "";
      state.userId = -1;
      state.logined = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
