import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    ordersRequested: (orders, action) => {
      orders.loading = true;
    },

    ordersReceived: (orders, action) => {
      orders.items = action.payload.data;
      orders.loading = false;
    },

    ordersRequestFailed: (orders, action) => {
      orders.loading = false;
    },

    orderShipped: (orders, action) => {
      const { data } = action.payload;
      const index = orders.items.findIndex((o) => o._id === data._id);
      orders.items[index] = data;
    },

    orderRequestFailed: (orders, action) => {
      const message = action.payload?.message;

      toast.warn(message);
    },
  },
});

export default slice.reducer;
const {
  ordersRequested,
  ordersReceived,
  ordersRequestFailed,
  orderShipped,
  orderRequestFailed,
} = slice.actions;

const url = "/orders";

export const loadOrders = () =>
  apiCallBegan({
    url,
    onStart: ordersRequested.type,
    onSuccess: ordersReceived.type,
    onError: ordersRequestFailed.type,
  });

export const loadMyOrders = () =>
  apiCallBegan({
    url: `${url}/mine`,
    onStart: ordersRequested.type,
    onSuccess: ordersReceived.type,
    onError: ordersRequestFailed.type,
  });

export const shipOrder = (id) =>
  apiCallBegan({
    url: `${url}/${id}/shipped`,
    method: "patch",
    onSuccess: orderShipped.type,
    onError: orderRequestFailed.type,
  });
