import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "cart",
  initialState: {
    items: null,
    loading: false,
  },
  reducers: {
    itemsRequested: (cart, action) => {
      cart.loading = true;
    },

    itemsReceived: (cart, action) => {
      cart.items = action.payload.data;
      cart.loading = false;
    },

    itemsRequestFailed: (cart, action) => {
      cart.loading = false;
    },

    itemAdded: (cart, action) => {
      cart.items = action.payload.data;
      cart.loading = false;
    },

    itemIncreased: (cart, action) => {
      cart.items = action.payload.data;
    },

    itemDecreased: (cart, action) => {
      cart.items = action.payload.data;
    },

    itemRemoved: (cart, action) => {
      cart.items = action.payload.data;
      cart.loading = false;
    },

    itemsRemoved: (cart, action) => {
      cart.items = null;
      cart.loading = false;
    },

    itemsReset: (cart, action) => {
      cart.items = null;
    },

    itemRequestFailed: (cart, action) => {
      const message = action.payload?.message;

      cart.loading = false;
      toast.warn(message);
    },
  },
});

export default slice.reducer;
const {
  itemsRequested,
  itemsReceived,
  itemsRequestFailed,
  itemAdded,
  itemIncreased,
  itemDecreased,
  itemRemoved,
  itemsRemoved,
  itemRequestFailed,
  itemsReset,
} = slice.actions;

const url = "/cart";

export const loadCart = () =>
  apiCallBegan({
    url,
    onStart: itemsRequested.type,
    onSuccess: itemsReceived.type,
    onError: itemsRequestFailed.type,
  });

export const addToCart = (productId, qty) =>
  apiCallBegan({
    url: `${url}/add-to-cart`,
    method: "post",
    data: { productId, qty: Number(qty) },
    onStart: itemsRequested.type,
    onSuccess: itemAdded.type,
    onError: itemRequestFailed.type,
  });

export const increaseCart = (productId) =>
  apiCallBegan({
    url: `${url}/increase-cart`,
    method: "post",
    data: { productId },
    onSuccess: itemIncreased.type,
    onError: itemRequestFailed.type,
  });

export const decreaseCart = (productId) =>
  apiCallBegan({
    url: `${url}/decrease-cart`,
    method: "post",
    data: { productId },
    onSuccess: itemDecreased.type,
    onError: itemRequestFailed.type,
  });

export const removeFromCart = (id) =>
  apiCallBegan({
    url: `${url}/remove-from-cart/${id}`,
    method: "delete",
    onStart: itemsRequested.type,
    onSuccess: itemRemoved.type,
    onError: itemRequestFailed.type,
  });

export const clearCart = () =>
  apiCallBegan({
    url: `${url}/clear-cart`,
    method: "delete",
    onStart: itemsRequested.type,
    onSuccess: itemsRemoved.type,
    onError: itemRequestFailed.type,
  });

export const resetCart = () => itemsReset();
