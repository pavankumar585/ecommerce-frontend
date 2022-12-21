import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../store/api";
import { toast } from "react-toastify";

const slice = createSlice({
  name: "products",
  initialState: {
    product: null,
    similarProducts: [],
    list: [],
    loading: false,
    error: false,
    isSuccess: false,
  },
  reducers: {
    productsRequested: (products, action) => {
      products.loading = true;
      products.error = false;
      products.isSuccess = false;
    },

    productsReceived: (products, action) => {
      const { data } = action.payload;
      products.list = data;
      products.loading = false;
      products.lastFetch = Date.now();
    },

    productsRequestFailed: (products, action) => {
      products.loading = false;
      products.error = true;
    },

    productRequested: (products, action) => {
      products.loading = true;
      products.error = false;
    },

    productReceived: (products, action) => {
      const { data } = action.payload;
      products.product = data.product;
      products.similarProducts = data.similarProducts;
      products.loading = false;
    },

    productAdded: (products, action) => {
      const { data } = action.payload;
      products.list.push(data);
      products.loading = false;
      products.isSuccess = true;
      toast.success("Product added successfully!");
    },

    productUpdated: (products, action) => {
      const { data } = action.payload;
      const index = products.list.findIndex((p) => p._id === data._id);
      products.list[index] = data;
      products.loading = false;
      products.isSuccess = true;
      toast.success("Product updated successfully!");
    },

    productDeleted: (products, action) => {
      const { data } = action.payload;
      const index = products.list.findIndex((p) => p._id === data._id);
      products.list.splice(index, 1);
      toast.success("Product deleted successfully!");
    },

    productRequestFailed: (products, action) => {
      products.loading = false;
      products.error = true;
    },
  },
});

export default slice.reducer;
const {
  productsRequested,
  productsReceived,
  productsRequestFailed,
  productRequested,
  productReceived,
  productAdded,
  productUpdated,
  productDeleted,
  productRequestFailed,
} = slice.actions;

const url = "/products";

export const loadProducts = () =>
  apiCallBegan({
    url,
    onStart: productsRequested.type,
    onSuccess: productsReceived.type,
    onError: productsRequestFailed.type,
  });

export const loadFewProducts = () =>
  apiCallBegan({
    url: `${url}/few`,
    onStart: productsRequested.type,
    onSuccess: productsReceived.type,
    onError: productsRequestFailed.type,
  });

export const loadProductsByCategory = (name) =>
  apiCallBegan({
    url: `${url}/category/${name}`,
    onStart: productsRequested.type,
    onSuccess: productsReceived.type,
    onError: productsRequestFailed.type,
  });

export const loadProduct = (id) =>
  apiCallBegan({
    url: `${url}/${id}`,
    onStart: productRequested.type,
    onSuccess: productReceived.type,
    onError: productRequestFailed.type,
  });

export const addProduct = (product) =>
  apiCallBegan({
    url,
    method: "post",
    data: product,
    onStart: productRequested.type,
    onSuccess: productAdded.type,
    onError: productRequestFailed.type,
  });

export const updateProduct = (product) => {
  const body = { ...product };
  delete body._id;

  return apiCallBegan({
    url: `${url}/${product._id}`,
    method: "put",
    data: body,
    onStart: productRequested.type,
    onSuccess: productUpdated.type,
    onError: productRequestFailed.type,
  });
};

export const deleteProduct = (product) =>
  apiCallBegan({
    url: `${url}/${product._id}`,
    method: "delete",
    onSuccess: productDeleted.type,
    onError: productRequestFailed.type,
  });
