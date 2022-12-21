import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import { toast } from "react-toastify";

const slice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    authToken: null,
    loading: false,
  },
  reducers: {
    userLoginStart: (user, action) => {
      user.loading = true;
    },

    userLoginSuccess: (user, action) => {
      const { data, header } = action.payload;

      user.currentUser = data;
      user.authToken = header;
      user.loading = false;
    },

    userLoginFailed: (user, action) => {
      const message = action.payload?.message;

      user.loading = false;
      toast.error(message);
    },

    userSignupStart: (user, action) => {
      user.loading = true;
    },

    userSignupSuccess: (user, action) => {
      const { data, header } = action.payload;

      user.currentUser = data;
      user.authToken = header;
      user.loading = false;
    },

    userSignupFailed: (user, action) => {
      const message = action.payload?.message;

      user.loading = false;
      toast.error(message);
    },

    userLogoutSuccess: (user, action) => {
      user.currentUser = null;
      user.authToken = null;
    },
  },
});

export default slice.reducer;
const {
  userLoginStart,
  userLoginSuccess,
  userLoginFailed,
  userSignupStart,
  userSignupSuccess,
  userSignupFailed,
  userLogoutSuccess,
} = slice.actions;

export const loginUser = (user) =>
  apiCallBegan({
    url: "/auth",
    method: "post",
    data: user,
    onStart: userLoginStart.type,
    onSuccess: userLoginSuccess.type,
    onError: userLoginFailed.type,
  });

export const signupUser = (user) =>
  apiCallBegan({
    url: "/users",
    method: "post",
    data: user,
    onStart: userSignupStart.type,
    onSuccess: userSignupSuccess.type,
    onError: userSignupFailed.type,
  });

export const logoutUser = () => userLogoutSuccess();
