import { createRoot } from "react-dom/client";
import "./assets/css/main.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import HomTemplate from "./template/HomTemplate";
import IndexPage from "./page/IndexPage";
import SearchPage from "./page/SearchPage";
import CartProduct from "./page/CartProduct";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import DetailProduct from "./page/DetailProduct";
import ProfilePage from "./page/ProfilePage";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="" element={<HomTemplate />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/search-shoe" element={<SearchPage />} />
          <Route path="/cart-shoe" element={<CartProduct />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/detail-shoe/:id" element={<DetailProduct />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Provider>
  </BrowserRouter>,
);
