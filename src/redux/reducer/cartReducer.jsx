import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/appConstants";

const initialState = {
  arrCart: [],
};

const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCartRedux: (state, action) => {
      const { id, size, quantity } = action.payload;
      const item = state.arrCart.find((p) => p.id === id && p.size === size);
      if (item) {
        item.quantity += quantity;
      } else {
        state.arrCart.push(action.payload);
      }
    },

    changeQuantityRedux: (state, action) => {
      const { id, size, quantity } = action.payload;
      const item = state.arrCart.find((p) => p.id === id && p.size === size);
      if (item) {
        item.quantity = Math.max(1, item.quantity + quantity);
      }
    },

    removeFromCartRedux: (state, action) => {
      const { id, size } = action.payload;
      state.arrCart = state.arrCart.filter(
        (p) => !(p.id === id && p.size === size),
      );
    },

    clearCartRedux: (state) => {
      state.arrCart = [];
    },
  },
});

export const {
  addToCartRedux,
  changeQuantityRedux,
  removeFromCartRedux,
  clearCartRedux,
} = cartReducer.actions;

export default cartReducer.reducer;

export const submitOrderReducer = (email) => {
  return async (dispatch, getState) => {
    const arrCart = getState().cartReducer.arrCart;

    const payload = {
      orderDetail: arrCart.map((item) => ({
        productId: String(item.id),
        quantity: item.quantity,
      })),
      email,
    };

    const result = await axios.post(`${API_URL}/Users/order`, payload);
    try {
      const saved = JSON.parse(localStorage.getItem("orderSizes") || "[]");
      const orderedItems = arrCart.map((item) => ({
        email,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        time: Date.now(),
      }));
      localStorage.setItem(
        "orderSizes",
        JSON.stringify([...saved, ...orderedItems]),
      );
    } catch (error) {
      console.log("Không lưu được size:", error);
    }

    dispatch(clearCartRedux());

    return result.data;
  };
};
