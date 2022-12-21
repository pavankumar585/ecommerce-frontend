import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../store/api";

const slice = createSlice({
  name: "users",
  initialState: {
    user: null,
    list: [],
    loading: false,
  },
  reducers: {
    usersRequeted: (users, action) => {
      users.loading = true;
    },

    usersReceived: (users, action) => {
      const { data } = action.payload;
      users.list = data;
      users.loading = false;
    },

    usersRequestFailed: (users, action) => {
      users.loading = false;
    },

    userRequeted: (users, action) => {
      users.loading = true;
    },

    userProfileReceived: (users, action) => {
      const { data } = action.payload;
      users.user = data;
      users.loading = false;
    },

    userMarkedAsAdmin: (users, action) => {
      const { data } = action.payload;
      const index = users.list.findIndex((user) => user._id === data._id);
      users.list[index] = data;
    },

    userRevokedAsAdmin: (users, action) => {
      const { data } = action.payload;
      const index = users.list.findIndex((user) => user._id === data._id);
      users.list[index] = data;
    },

    userDeleted: (users, action) => {
      const { data } = action.payload;
      const index = users.list.findIndex((user) => user._id === data._id);
      users.list.splice(index, 1);
    },

    userRequestFailed: (users, action) => {
      users.loading = false;
    },
  },
});

export default slice.reducer;
const {
  userRequeted,
  userProfileReceived,
  userDeleted,
  userRequestFailed,
  usersRequeted,
  usersReceived,
  userMarkedAsAdmin,
  userRevokedAsAdmin,
  usersRequestFailed,
} = slice.actions;

const url = "/users";

export const loadUsers = () =>
  apiCallBegan({
    url,
    onStart: usersRequeted.type,
    onSuccess: usersReceived.type,
    onError: usersRequestFailed.type,
  });

export const loadMyProfile = () =>
  apiCallBegan({
    url: `${url}/me`,
    onStart: userRequeted.type,
    onSuccess: userProfileReceived.type,
    onError: userRequestFailed.type,
  });

export const deleteUser = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: "delete",
    onSuccess: userDeleted.type,
    onError: userRequestFailed.type,
  });

export const markUserAsAdmin = (id) =>
  apiCallBegan({
    url: `${url}/${id}/make-admin`,
    method: "patch",
    onSuccess: userMarkedAsAdmin.type,
    onError: userRequestFailed.type,
  });

export const revokeUserAsAdmin = (id) =>
  apiCallBegan({
    url: `${url}/${id}/revoke-admin`,
    method: "patch",
    onSuccess: userRevokedAsAdmin.type,
    onError: userRequestFailed.type,
  });
