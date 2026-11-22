import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL, JSON_HEADERS } from "../../constants/appConstants";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );

    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const getStoredAccessToken = () => {
  const token = localStorage.getItem("accessToken");

  if (token && isTokenExpired(token)) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userLogin");
    return null;
  }

  return token;
};

const getLoginToken = (getState) => {
  const loginToken =
    getState().userReducer?.accessToken || localStorage.getItem("accessToken");

  if (!loginToken) {
    throw new Error("Bạn chưa đăng nhập!");
  }

  return loginToken;
};

const storedToken = getStoredAccessToken();

const initialState = {
  userLogin: storedToken
    ? JSON.parse(localStorage.getItem("userLogin") || "null")
    : null,
  accessToken: localStorage.getItem("accessToken") || null,
  userProfile: null,
  arrFavorite: [],
};

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setUserLoginRedux: (state, action) => {
      state.userLogin = action.payload;
      state.accessToken = action.payload.accessToken;
    },

    setUserProfileRedux: (state, action) => {
      state.userProfile = action.payload;
    },

    setFavoriteRedux: (state, action) => {
      state.arrFavorite = Array.isArray(action.payload) ? action.payload : [];
    },

    clearUserLoginRedux: (state) => {
      state.userLogin = null;
      state.accessToken = null;
      state.userProfile = null;
      state.arrFavorite = [];
    },
  },
});

export const {
  setUserLoginRedux,
  setUserProfileRedux,
  setFavoriteRedux,
  clearUserLoginRedux,
} = userReducer.actions;

export default userReducer.reducer;

export const registerApi = (userData) => {
  return async () => {
    try {
      const result = await axios.post(
        `${API_URL}/Users/signup`,
        {
          id: 0,
          email: userData.email,
          password: userData.password,
          name: userData.name,
          gender: userData.gender,
          phone: userData.phone,
        },
        { headers: JSON_HEADERS },
      );

      console.log("Kết quả đăng ký:", result.data);
    } catch (error) {
      console.log("Lỗi đăng ký:", error);
    }
  };
};

export const loginApi = (userData) => {
  return async (dispatch) => {
    try {
      const result = await axios.post(
        `${API_URL}/Users/signin`,
        {
          email: userData.email,
          password: userData.password,
        },
        { headers: JSON_HEADERS },
      );

      const userInfo = result.data.content;

      if (!userInfo?.accessToken) {
        throw new Error("Không nhận được accessToken từ API!");
      }

      localStorage.setItem("accessToken", userInfo.accessToken);
      localStorage.setItem("userLogin", JSON.stringify(userInfo));

      dispatch(setUserLoginRedux(userInfo));
    } catch (error) {
      console.log("Lỗi đăng nhập:", error);
    }
  };
};

export const logoutApi = () => {
  return async (dispatch) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userLogin");

    dispatch(clearUserLoginRedux());
  };
};

export const facebookLoginApi = (facebookToken) => {
  return async (dispatch) => {
    try {
      const result = await axios.post(
        `${API_URL}/Users/facebooklogin`,
        {
          facebookToken: facebookToken,
        },
        { headers: JSON_HEADERS },
      );

      const userInfo = result.data.content;

      if (!userInfo?.accessToken) {
        throw new Error("Không nhận được accessToken từ API!");
      }

      localStorage.setItem("accessToken", userInfo.accessToken);
      localStorage.setItem("userLogin", JSON.stringify(userInfo));

      dispatch(setUserLoginRedux(userInfo));
    } catch (error) {
      console.log("Lỗi Facebook Login:", error);
    }
  };
};

export const getProfileApi = () => {
  return async (dispatch, getState) => {
    try {
      const loginToken = getLoginToken(getState);

      const result = await axios.post(`${API_URL}/Users/getProfileV2`, null, {
        headers: {
          Authorization: loginToken,
        },
      });

      const profile = result.data.content;

      if (!profile || typeof profile !== "object") {
        throw new Error("Không lấy được thông tin tài khoản!");
      }

      const { password, ...profileWithoutPassword } = profile;

      dispatch(setUserProfileRedux(profileWithoutPassword));
    } catch (error) {
      console.log("Lỗi lấy thông tin Profile:", error);
    }
  };
};

export const updateProfileApi = (profileData) => {
  return async (dispatch, getState) => {
    try {
      const loginToken = getLoginToken(getState);

      const currentProfile = getState().userReducer?.userProfile || {};

      const userId = profileData.id ?? currentProfile.id ?? 0;

      const requestData = {
        id: userId,
        email: profileData.email,
        name: profileData.name,
        gender: profileData.gender,
        phone: profileData.phone,
      };

      if (profileData.password?.trim()) {
        requestData.password = profileData.password;
      }

      const result = await axios.post(
        `${API_URL}/Users/updateProfile`,
        requestData,
        {
          headers: {
            ...JSON_HEADERS,
            Authorization: loginToken,
          },
        },
      );

      const { password, ...profileWithoutPassword } = requestData;

      dispatch(
        setUserProfileRedux({
          ...currentProfile,
          ...profileWithoutPassword,
        }),
      );
    } catch (error) {
      console.log("Lỗi cập nhật Profile:", error);
    }
  };
};

export const getFavoriteApi = () => {
  return async (dispatch, getState) => {
    const loginToken = getLoginToken(getState);

    const result = await axios.get(`${API_URL}/Users/getproductfavorite`, {
      headers: {
        Authorization: loginToken,
      },
    });

    dispatch(setFavoriteRedux(result.data.content?.productsFavorite));
  };
};

export const toggleFavoriteApi = (productId) => {
  return async (dispatch, getState) => {
    const loginToken = getLoginToken(getState);

    const arrFavorite = getState().userReducer?.arrFavorite ?? [];

    const isFavorite = arrFavorite.some(
      (product) => String(product.id) === String(productId),
    );

    await axios.get(`${API_URL}/Users/${isFavorite ? "unlike" : "like"}`, {
      params: { productId },
      headers: {
        Authorization: loginToken,
      },
    });

    await dispatch(getFavoriteApi());
  };
};
