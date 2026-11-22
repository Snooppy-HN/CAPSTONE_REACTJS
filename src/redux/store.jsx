import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducer/productReducer.jsx";
import cartReducer from "./reducer/cartReducer.jsx";
import userReducer from "./reducer/userReducer.jsx";

export const store = configureStore({
  reducer: {
    productReducer,
    cartReducer,
    userReducer,
  },
});
