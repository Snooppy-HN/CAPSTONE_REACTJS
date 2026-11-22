import React, { useEffect, useState } from "react";
import avatar from "../assets/img/avatar.png";
import { NavLink, useNavigate } from "react-router-dom";
import useRedux from "../customhooks/useRedux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getProfileApi,
  updateProfileApi,
  logoutApi,
} from "../redux/reducer/userReducer";
import useFavorite from "../customhooks/useFavorite";

const getApiErrorMessage = (error, defaultMessage) => {
  if (error.response?.status === 401) {
    return "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!";
  }

  const apiMessage =
    error.response?.data?.message || error.response?.data?.content;

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  return error.message || defaultMessage;
};

const ORDERS_PER_PAGE = 5;

const formatOrderDate = (dateString) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${month} / ${day} / ${date.getFullYear()}`;
};

const getOrderTotal = (order) =>
  (order.orderDetail ?? []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

const getSavedSizes = () => {
  try {
    return JSON.parse(localStorage.getItem("orderSizes") || "[]");
  } catch {
    return [];
  }
};

const ProfilePage = () => {
  const { rootState, dispatch } = useRedux();
  const { arrFavorite, toggleFavorite } = useFavorite();
  const navigate = useNavigate();

  const accessToken = rootState.userReducer?.accessToken;
  const profile = rootState.userReducer?.userProfile;

  const savedSizes = getSavedSizes();

  const [currentPage, setCurrentPage] = useState(1);
  const [openOrderKey, setOpenOrderKey] = useState(null);

  const orders = [...(profile?.ordersHistory ?? [])]
    .sort(
      (a, b) =>
        (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0),
    )
    .map((order, index) => ({
      ...order,
      orderKey: String(order.id ?? index),
    }));

  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedOrders = orders.slice(
    (safePage - 1) * ORDERS_PER_PAGE,
    safePage * ORDERS_PER_PAGE,
  );

  const activeOrderKey = openOrderKey ?? pagedOrders[0]?.orderKey;

  const handleToggleOrder = (orderKey) => {
    setOpenOrderKey(activeOrderKey === orderKey ? "" : orderKey);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
    setOpenOrderKey(null);
  };

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: profile?.email ?? "",
      name: profile?.name ?? "",
      phone: profile?.phone ?? "",
      gender:
        profile?.gender === true || profile?.gender === "true"
          ? true
          : profile?.gender === false || profile?.gender === "false"
            ? false
            : null,
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .required("Email không được để trống")
        .email("Email không hợp lệ"),

      name: Yup.string()
        .trim()
        .required("Họ tên không được để trống")
        .matches(
          /^(?!.*\d)(?!.* {2,})[\p{L}]+(?: [\p{L}]+)*$/u,
          "Họ tên phải là kí tự chữ",
        ),

      phone: Yup.string()
        .trim()
        .required("Số điện thoại không được để trống")
        .matches(
          /^(\+84|0)\d{9}$/,
          "Số điện thoại phải có 10 số và bắt đầu bằng số 0 hoặc +84",
        ),

      password: Yup.string().test(
        "password-strength",
        "Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
        (value) =>
          !value?.trim() ||
          /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(
            value,
          ),
      ),

      gender: Yup.boolean().nullable().required("Vui lòng chọn giới tính"),
    }),

    onSubmit: async (values, { setFieldValue }) => {
      const profileData = {
        id: profile?.id,
        email: values.email.trim(),
        name: values.name.trim(),
        gender: values.gender,
        phone: values.phone.trim(),
      };

      if (values.password.trim()) {
        profileData.password = values.password;
      }

      try {
        const result = await dispatch(updateProfileApi(profileData));

        console.log("Kết quả updateProfile:", result);

        const successMessage =
          typeof result.content === "string"
            ? result.content
            : result.message || "Cập nhật thông tin thành công!";

        alert(successMessage);

        setFieldValue("password", "");
      } catch (error) {
        console.log("Lỗi cập nhật Profile:", error);

        alert(getApiErrorMessage(error, "Cập nhật thông tin thất bại!"));
      }
    },
  });

  useEffect(() => {
    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    dispatch(getProfileApi()).catch(async (error) => {
      console.log("Lỗi lấy thông tin Profile:", error);

      if (error.response?.status === 401 || !error.response) {
        await dispatch(logoutApi());
        navigate("/login", { replace: true });
        return;
      }

      alert(getApiErrorMessage(error, "Không thể lấy thông tin tài khoản!"));
    });
  }, [accessToken, dispatch, navigate]);

  const handleLogout = async () => {
    await dispatch(logoutApi());

    navigate("/login", { replace: true });
  };

  if (!accessToken) {
    return null;
  }

  return (
    <main className="flex-grow-1 py-4 py-lg-5">
      <div className="container-xl">
        <div className="mb-4">
          <p className="small fw-bold text-warning text-uppercase mb-2">
            MEMBER SPACE / ACCOUNT
          </p>

          <h1 className="display-4 fw-bolder text-uppercase mb-0">
            My account<span className="text-warning">.</span>
          </h1>
        </div>

        <div className="row g-4 align-items-start">
          <aside className="col-lg-3">
            <div className="card text-bg-dark border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <img
                    src={profile?.avatar || avatar}
                    width={76}
                    height={76}
                    className="rounded-circle bg-white object-fit-cover"
                    alt="Member avatar"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = avatar;
                    }}
                  />

                  <div>
                    <div className="small text-warning fw-bold text-uppercase">
                      Welcome back
                    </div>

                    <h2 className="h5 fw-bold mb-0">
                      {formik.values.name || "GREEDY MEMBER"}
                    </h2>

                    <div className="small text-white-50">
                      {formik.values.email || "Member profile"}
                    </div>
                  </div>
                </div>

                <hr className="border-secondary" />

                <nav className="nav nav-pills flex-column gap-2">
                  <a
                    className="nav-link active bg-warning text-dark fw-bold rounded-0"
                    href="#profileDetails"
                  >
                    Profile details
                  </a>

                  <a className="nav-link text-white" href="#orders">
                    Order history
                  </a>

                  <a className="nav-link text-white" href="#favourites">
                    Favourite products
                  </a>

                  <NavLink className="nav-link text-white" to="/cart-shoe">
                    My bag
                  </NavLink>

                  <button
                    type="button"
                    className="nav-link text-white border-0 bg-transparent text-start w-100"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </nav>
              </div>
            </div>

            <div className="bg-warning rounded-4 p-4 mt-3">
              <div className="small fw-bold text-uppercase mb-2">
                Your next move
              </div>

              <p className="small mb-3">See what's in the current rotation.</p>

              <NavLink
                className="btn btn-dark rounded-0 w-100 fw-bold"
                to="/search-shoe"
              >
                EXPLORE PRODUCTS ↗
              </NavLink>
            </div>
          </aside>

          <div className="col-lg-9">
            <section
              id="profileDetails"
              className="card border-0 rounded-4 shadow-sm mb-4"
            >
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
                  <div>
                    <p className="small fw-bold text-warning text-uppercase mb-1">
                      YOUR INFORMATION
                    </p>
                    <h2 className="h4 fw-bold text-uppercase mb-0">
                      Profile details
                    </h2>
                  </div>
                  <span className="badge text-bg-light rounded-0">
                    EDIT YOUR DETAILS
                  </span>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="name"
                        className="form-label small fw-bold text-uppercase"
                      >
                        Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        className="form-control rounded-0"
                        type="text"
                        placeholder="Enter your name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.name && formik.errors.name && (
                        <p className="text text-danger mb-0">
                          {formik.errors.name}
                        </p>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label
                        htmlFor="email"
                        className="form-label small fw-bold text-uppercase"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        name="email"
                        className="form-control rounded-0"
                        type="email"
                        placeholder="name@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.email && formik.errors.email && (
                        <p className="text text-danger mb-0">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label
                        htmlFor="phone"
                        className="form-label small fw-bold text-uppercase"
                      >
                        Phone
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        className="form-control rounded-0"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.phone && formik.errors.phone && (
                        <p className="text text-danger mb-0">
                          {formik.errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label
                        htmlFor="password"
                        className="form-label small fw-bold text-uppercase"
                      >
                        Password
                      </label>

                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-control rounded-0"
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.password && formik.errors.password && (
                        <p className="text text-danger mb-0">
                          {formik.errors.password}
                        </p>
                      )}

                      <div className="form-text">
                        * Leave blank to keep your current password.
                      </div>
                    </div>

                    <div className="col-md-6">
                      <fieldset>
                        <legend className="form-label small fw-bold text-uppercase">
                          Gender
                        </legend>

                        <div className="d-flex gap-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id="profileMale"
                              checked={formik.values.gender === true}
                              onChange={() =>
                                formik.setFieldValue("gender", true)
                              }
                              required
                            />

                            <label
                              className="form-check-label"
                              htmlFor="profileMale"
                            >
                              Male
                            </label>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id="profileFemale"
                              checked={formik.values.gender === false}
                              onChange={() =>
                                formik.setFieldValue("gender", false)
                              }
                              required
                            />

                            <label
                              className="form-check-label"
                              htmlFor="profileFemale"
                            >
                              Female
                            </label>
                          </div>
                        </div>

                        {formik.touched.gender && formik.errors.gender && (
                          <p className="text text-danger mt-2 mb-0">
                            {formik.errors.gender}
                          </p>
                        )}
                      </fieldset>
                    </div>

                    <div className="col-md-6 d-flex align-items-end justify-content-md-end">
                      <button
                        type="submit"
                        className="btn btn-warning rounded-0 fw-bold px-4"
                      >
                        SAVE CHANGES ↗
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </section>

            <section
              id="orders"
              className="card border-0 rounded-4 shadow-sm mb-4"
            >
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex justify-content-between align-items-end gap-2 mb-4">
                  <div>
                    <p className="small fw-bold text-warning text-uppercase mb-1">
                      PURCHASES
                    </p>

                    <h2 className="h4 fw-bold text-uppercase mb-0">
                      Order history
                    </h2>
                  </div>

                  <span className="small text-secondary">
                    {orders.length} {orders.length === 1 ? "order" : "orders"}
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center text-secondary py-4">
                    <p className="mb-3">You have no orders yet.</p>

                    <NavLink
                      className="btn btn-dark rounded-0 fw-bold"
                      to="/search-shoe"
                    >
                      START SHOPPING ↗
                    </NavLink>
                  </div>
                ) : (
                  <>
                    <div className="accordion">
                      {pagedOrders.map((order) => {
                        const isOpen = activeOrderKey === order.orderKey;

                        const statusText =
                          order.status === "CHUAGIAO"
                            ? "Not delivered"
                            : order.status === "DAGIAO"
                              ? "Delivered"
                              : order.status || "Processing";

                        return (
                          <div
                            className="accordion-item border rounded-3 mb-2"
                            key={order.orderKey}
                          >
                            <h3 className="accordion-header">
                              <button
                                className={`accordion-button fw-bold ${
                                  isOpen ? "" : "collapsed"
                                }`}
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() =>
                                  handleToggleOrder(order.orderKey)
                                }
                              >
                                ORDER #{order.id}
                                <span className="ms-auto me-3 small text-secondary fw-normal">
                                  {formatOrderDate(order.date)}
                                </span>
                              </button>
                            </h3>

                            <div
                              className={`accordion-collapse collapse ${
                                isOpen ? "show" : ""
                              }`}
                            >
                              <div className="accordion-body">
                                {(order.orderDetail ?? []).map(
                                  (item, itemIndex) => {
                                    const size = savedSizes.findLast(
                                      (saved) =>
                                        saved.email === profile?.email &&
                                        saved.name === item.name &&
                                        saved.quantity === item.quantity,
                                    )?.size;

                                    return (
                                      <div
                                        className="row align-items-center g-3"
                                        key={`${order.orderKey}-${itemIndex}`}
                                      >
                                        <div className="col-4 col-md-2">
                                          <img
                                            src={item.image}
                                            className="img-fluid bg-body-tertiary rounded-3"
                                            alt={item.name}
                                          />
                                        </div>

                                        <div className="col-8 col-md-6">
                                          <div className="fw-bold text-capitalize">
                                            {item.name}
                                          </div>

                                          <div className="small text-secondary">
                                            {size ? `Size ${size} · ` : ""}
                                            Quantity {item.quantity} · Price{" "}
                                            {item.price}$
                                          </div>

                                          {itemIndex === 0 && (
                                            <span
                                              className={`badge ${
                                                order.status === "CHUAGIAO" ||
                                                !order.status
                                                  ? "text-bg-success"
                                                  : "text-bg-warning text-dark"
                                              } mt-2`}
                                            >
                                              {statusText}
                                            </span>
                                          )}
                                        </div>

                                        <div className="col-md-4 text-md-end">
                                          {itemIndex === 0 && (
                                            <>
                                              <div className="small text-secondary">
                                                Order total
                                              </div>
                                              <div className="h5 fw-bold mb-0">
                                                {getOrderTotal(order)}$
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {totalPages > 1 && (
                      <nav className="mt-4" aria-label="Order history pages">
                        <ul className="pagination pagination-sm justify-content-end mb-0">
                          <li
                            className={`page-item ${
                              safePage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              type="button"
                              className="page-link text-dark"
                              onClick={() => handleChangePage(safePage - 1)}
                            >
                              ←
                            </button>
                          </li>

                          {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1,
                          ).map((page) => {
                            return (
                              <li
                                key={page}
                                className={`page-item ${
                                  page === safePage ? "active" : ""
                                }`}
                              >
                                <button
                                  type="button"
                                  className={`page-link ${
                                    page === safePage
                                      ? "bg-dark border-dark"
                                      : "text-dark"
                                  }`}
                                  onClick={() => handleChangePage(page)}
                                >
                                  {page}
                                </button>
                              </li>
                            );
                          })}

                          <li
                            className={`page-item ${
                              safePage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              type="button"
                              className="page-link text-dark"
                              onClick={() => handleChangePage(safePage + 1)}
                            >
                              →
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </>
                )}
              </div>
            </section>

            <section
              id="favourites"
              className="card border-0 rounded-4 shadow-sm"
            >
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex justify-content-between align-items-end gap-2 mb-4">
                  <div>
                    <p className="small fw-bold text-warning text-uppercase mb-1">
                      YOUR SHORTLIST / {arrFavorite.length} SAVED
                    </p>

                    <h2 className="h4 fw-bold text-uppercase mb-0">
                      Favourite products
                    </h2>
                  </div>

                  <NavLink
                    className="small fw-bold link-dark text-decoration-none"
                    to="/search-shoe"
                  >
                    DISCOVER MORE ↗
                  </NavLink>
                </div>

                <div className="row g-3">
                  {arrFavorite.map((product) => {
                    return (
                      <div
                        className="col-12 col-sm-6 col-lg-4"
                        key={product.id}
                      >
                        <article className="card h-100 border-0 rounded-4 overflow-hidden shadow-sm">
                          <div className="position-relative bg-body-tertiary">
                            <NavLink
                              className="d-block p-3 p-lg-4"
                              to={`/detail-shoe/${product.id}`}
                            >
                              <div className="ratio ratio-4x3">
                                <img
                                  src={product.image}
                                  className="w-100 h-100 object-fit-contain"
                                  alt={product.name}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "assets/shoe.png";
                                  }}
                                />
                              </div>
                            </NavLink>

                            <span className="badge text-bg-dark rounded-0 position-absolute top-0 start-0 m-3">
                              SAVED
                            </span>

                            <button
                              type="button"
                              className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3"
                              aria-label={`Remove ${product.name} from favourites`}
                              onClick={() => toggleFavorite(product.id)}
                            >
                              <span className="text-danger">♥</span>
                            </button>
                          </div>

                          <div className="card-body px-4 pt-4 pb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="text-secondary small">
                                GRED / {String(product.id).padStart(2, "0")}
                              </span>

                              <span className="text-secondary small text-uppercase">
                                {product.name}
                              </span>
                            </div>

                            <h3 className="h5 fw-bold mb-1">
                              <NavLink
                                className="link-dark text-decoration-none"
                                to={`/detail-shoe/${product.id}`}
                              >
                                {product.name}
                              </NavLink>
                            </h3>

                            <p className="small text-secondary mb-0">
                              {product.shortDescription
                                ? product.shortDescription
                                    .charAt(0)
                                    .toUpperCase() +
                                  product.shortDescription.slice(1)
                                : ""}
                            </p>
                          </div>

                          <div className="card-footer bg-white border-0 px-4 pb-4 pt-0">
                            <div className="d-flex justify-content-between align-items-center border-top pt-3">
                              <span className="h5 fw-bold mb-0">
                                {product.price}$
                              </span>

                              <NavLink
                                className="btn btn-dark rounded-0 px-4"
                                to={`/detail-shoe/${product.id}`}
                              >
                                VIEW PAIR
                                <span aria-hidden="true">→</span>
                              </NavLink>
                            </div>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
