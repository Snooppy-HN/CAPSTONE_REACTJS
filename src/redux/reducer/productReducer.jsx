import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../constants/appConstants";

const initialState = {
  arrShoe: [],
  arrShoeAll: [],
  arrCategory: [],
  shoeDetail: {},
  selectedSize: null,
};

const productReducer = createSlice({
  name: "productReducer",
  initialState,
  reducers: {
    setArrShoeRedux: (state, action) => {
      state.arrShoe = Array.isArray(action.payload) ? action.payload : [];
    },

    setAllShoeRedux: (state, action) => {
      state.arrShoeAll = Array.isArray(action.payload) ? action.payload : [];
    },

    setArrCategoryRedux: (state, action) => {
      state.arrCategory = Array.isArray(action.payload) ? action.payload : [];
    },

    setShoeDetailRedux: (state, action) => {
      state.shoeDetail = action.payload ?? {};
    },

    setSelectedSizeRedux: (state, action) => {
      state.selectedSize = action.payload;
    },

    resetSelectedSizeRedux: (state) => {
      state.selectedSize = null;
    },
  },
});

export const {
  setArrShoeRedux,
  setAllShoeRedux,
  setArrCategoryRedux,
  setShoeDetailRedux,
  setSelectedSizeRedux,
  resetSelectedSizeRedux,
} = productReducer.actions;

export default productReducer.reducer;

export const getAPIShoeReducer = () => {
  return async (dispatch) => {
    try {
      const result = await axios.get(`${API_URL}/Product`);

      const arrShoe = Array.isArray(result.data.content)
        ? result.data.content
        : [];

      dispatch(setAllShoeRedux(arrShoe));

      dispatch(setArrShoeRedux(arrShoe));
    } catch (error) {
      console.log("Lỗi API:", error);
    }
  };
};

export const getAllCategoryReducer = (keyword = "") => {
  return async (dispatch) => {
    try {
      const params = {};

      if (keyword.trim()) {
        params.keyword = keyword.trim();
      }

      const result = await axios.get(`${API_URL}/Product/getAllCategory`, {
        params,
      });

      const arrCategory = Array.isArray(result.data.content)
        ? result.data.content
        : [];

      dispatch(setArrCategoryRedux(arrCategory));
    } catch (error) {
      console.log("Lỗi lấy danh mục:", error);
    }
  };
};

export const getProductByCategoryReducer = (category) => {
  return async (dispatch, getState) => {
    try {
      const categoryId = category.id;

      if (!categoryId) {
        throw new Error("Không tìm thấy mã danh mục!");
      }

      try {
        const result = await axios.get(
          `${API_URL}/Product/getProductByCategory`,
          {
            params: {
              categoryId: categoryId,
            },
          },
        );

        const arrShoe = Array.isArray(result.data.content)
          ? result.data.content
          : [];

        dispatch(setArrShoeRedux(arrShoe));
      } catch (error) {
        if (
          error.response?.status !== 404 ||
          !Array.isArray(category.productList)
        ) {
          throw error;
        }

        const arrShoeAll = getState().productReducer.arrShoeAll || [];

        const productIds = new Set(
          category.productList.map((id) => String(id)),
        );

        const arrShoe = arrShoeAll.filter((shoe) =>
          productIds.has(String(shoe.id)),
        );

        dispatch(setArrShoeRedux(arrShoe));

        return {
          statusCode: 200,
          message: "Lọc sản phẩm theo danh mục thành công.",
          content: arrShoe,
        };
      }
    } catch (error) {
      console.log("Lỗi lọc sản phẩm theo danh mục:", error);
    }
  };
};

export const getShoeDetailReducer = (id) => {
  return async (dispatch) => {
    try {
      const result = await axios.get(`${API_URL}/Product/getbyid?id=${id}`);

      const actionPayload = setShoeDetailRedux(result.data.content);

      dispatch(actionPayload);
    } catch (error) {
      console.log(error);
    }
  };
};

export const getShoeSizes = (sizeData) => {
  if (Array.isArray(sizeData)) {
    return sizeData.map((size) => String(size).trim());
  }

  if (typeof sizeData === "number") {
    return [String(sizeData)];
  }

  if (typeof sizeData === "string" && sizeData.trim()) {
    try {
      const parsedSize = JSON.parse(sizeData);

      if (Array.isArray(parsedSize)) {
        return parsedSize.map((size) => String(size).trim());
      }

      return [String(parsedSize)];
    } catch {
      return sizeData
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);
    }
  }

  return [];
};

export const getShoeCategories = (shoe) => {
  const categories = shoe?.categories ?? shoe?.category;

  if (Array.isArray(categories)) {
    return categories;
  }

  if (categories && typeof categories === "object") {
    return [categories];
  }

  if (typeof categories === "string" && categories.trim()) {
    try {
      const parsedCategories = JSON.parse(categories);

      return Array.isArray(parsedCategories)
        ? parsedCategories
        : parsedCategories
          ? [parsedCategories]
          : [];
    } catch (error) {
      return [categories.trim()];
    }
  }

  return [];
};
