import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "./users";
import productsReducer from "./products";
import categoriesReducer from "./categories";
import cartReducer from "./cart";
import ordersReducer from "./orders";

export default combineReducers({
  users: usersReducer,
  products: productsReducer,
  categories: categoriesReducer,
  cart: cartReducer,
  orders: ordersReducer,
});
