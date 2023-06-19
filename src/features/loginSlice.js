import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "logined",
  initialState: {
    name: "",
    studentNumber: "",
    userId: -1,
    logined: false,
  },
  reducers: {
    login: (state, action) => {
      console.log(action.payload);
      state.name = action.payload?.name ?? "";
      state.studentNumber = action.payload?.studentNumber ?? "";
      state.userId = action.payload?.userId ?? -1;
      state.logined = true;
    },
    logout: (state) => {
      state.name = "";
      state.studentNumber = "";
      state.userId = -1;
      state.logined = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
