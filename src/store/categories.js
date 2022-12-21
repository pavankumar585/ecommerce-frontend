import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
import { toast } from "react-toastify";

const slice = createSlice({
  name: "categories",
  initialState: {
    category: null,
    list: [],
    loading: false,
    isSuccess: false,
  },
  reducers: {
    categoriesRequested: (categories, action) => {
      categories.loading = true;
      categories.isSuccess = false;
    },

    categoriesReceived: (categories, action) => {
      const { data } = action.payload;
      categories.list = data;
      categories.loading = false;
    },

    categoriesRequestFailed: (categories, action) => {
      categories.loading = false;
    },

    categoryRequested: (categories, action) => {
      categories.loading = true;
    },

    categoryAdded: (categories, action) => {
      const { data } = action.payload;
      categories.list.push(data);
      categories.loading = false;
      categories.isSuccess = true;
      toast.success("Category added successfully!");
    },

    categoryUpdated: (categories, action) => {
      const { data } = action.payload;
      const index = categories.list.findIndex((c) => c._id === data._id);
      categories.list[index] = data;
      categories.loading = false;
      categories.isSuccess = true;
      toast.success("Category updated successfully!");
    },

    categoryDeleted: (categories, action) => {
      const { data } = action.payload;
      const index = categories.list.findIndex((c) => c._id === data._id);
      categories.list.splice(index, 1);
      toast.success("Category deleted successfully!");
    },

    categoryRequestFailed: (categories, action) => {
      categories.loading = false;
    },
  },
});

export default slice.reducer;
const {
  categoriesRequested,
  categoriesReceived,
  categoriesRequestFailed,
  categoryRequested,
  categoryAdded,
  categoryUpdated,
  categoryDeleted,
  categoryRequestFailed,
} = slice.actions;

const url = "/categories";

export const loadCategories = () =>
  apiCallBegan({
    url,
    onStart: categoriesRequested.type,
    onSuccess: categoriesReceived.type,
    onError: categoriesRequestFailed.type,
  });

export const addCategory = (category) =>
  apiCallBegan({
    url,
    method: "post",
    data: category,
    onStart: categoryRequested.type,
    onSuccess: categoryAdded.type,
    onError: categoryRequestFailed.type,
  });

export const updateCategory = (category) => {
  const body = { ...category };
  delete body._id;

  return apiCallBegan({
    url: `${url}/${category._id}`,
    method: "put",
    data: body,
    onStart: categoryRequested.type,
    onSuccess: categoryUpdated.type,
    onError: categoryRequestFailed.type,
  });
};

export const deleteCategory = (category) =>
  apiCallBegan({
    url: `${url}/${category._id}`,
    method: "delete",
    onSuccess: categoryDeleted.type,
    onError: categoryRequestFailed.type,
  });
