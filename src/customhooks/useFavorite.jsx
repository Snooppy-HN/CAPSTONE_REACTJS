import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRedux from "./useRedux";
import {
  getFavoriteApi,
  toggleFavoriteApi,
} from "../redux/reducer/userReducer";

const useFavorite = () => {
  const { rootState, dispatch } = useRedux();

  const navigate = useNavigate();

  const accessToken = rootState.userReducer?.accessToken;
  const arrFavorite = rootState.userReducer?.arrFavorite ?? [];

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    dispatch(getFavoriteApi()).catch(async (error) => {
      console.log("Lỗi lấy danh sách yêu thích:", error);

      if (error.response?.status === 401) {
        await dispatch(logoutApi());
      }
    });
  }, [accessToken, dispatch]);

  const isFavorite = (productId) =>
    arrFavorite.some((product) => String(product.id) === String(productId));

  const toggleFavorite = async (productId) => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập để thêm sản phẩm yêu thích!");
      navigate("/login");
      return;
    }

    try {
      await dispatch(toggleFavoriteApi(productId));
    } catch (error) {
      console.log("Lỗi cập nhật yêu thích:", error);

      if (error.response?.status === 401) {
        await dispatch(logoutApi());
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
        return;
      }

      alert("Không thể cập nhật sản phẩm yêu thích, vui lòng thử lại!");
    }
  };

  return { arrFavorite, isFavorite, toggleFavorite };
};

export default useFavorite;
