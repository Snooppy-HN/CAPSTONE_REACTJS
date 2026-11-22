import React, { useEffect } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import useRedux from "../customhooks/useRedux";
import {
  changeQuantityRedux,
  removeFromCartRedux,
  submitOrderReducer,
} from "../redux/reducer/cartReducer";

const CartProduct = () => {
  const { rootState, dispatch } = useRedux();
  const navigate = useNavigate();

  const arrCart = rootState.cartReducer.arrCart;
  const userLogin = rootState.userReducer?.userLogin;

  useEffect(() => {
    if (!userLogin?.email) {
      alert("Vui lòng đăng nhập để xem giỏ hàng!");
      navigate("/login");
    }
  }, []);

  const totalQuantity = arrCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = arrCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleRemove = (item) => {
    if (
      window.confirm(`Xóa "${item.name}" (size ${item.size}) khỏi giỏ hàng?`)
    ) {
      dispatch(removeFromCartRedux({ id: item.id, size: item.size }));
    }
  };

  const handleSubmitOrder = async () => {
    if (arrCart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    try {
      await dispatch(submitOrderReducer(userLogin.email));

      alert("Đặt hàng thành công!");
      navigate("/profile");
    } catch (error) {
      console.log("Lỗi đặt hàng:", error);
      alert("Đặt hàng thất bại, vui lòng thử lại!");
    }
  };

  if (!userLogin?.email) {
    return null;
  }

  return (
    <main className="flex-grow-1">
      <section className="bg-black text-white py-5">
        <div className="container-xl">
          <div className="row align-items-end">
            <div className="col-md-8">
              <p className="small fw-bold text-warning text-uppercase mb-2">
                YOUR SELECTION / GREEDY PRODUCT
              </p>

              <h1 className="display-2 fw-bolder text-uppercase mb-0">
                Your bag<span className="text-warning">.</span>
              </h1>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <span className="badge text-bg-warning text-dark rounded-0 px-3 py-2">
                {String(totalQuantity).padStart(2, "0")}{" "}
                {totalQuantity > 1 ? "ITEMS" : "ITEM"} IN YOUR BAG
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-xl py-5">
        <div className="row g-4 g-xl-5 align-items-start">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <h2 className="h5 fw-bold text-uppercase mb-0">Selected item</h2>

              <span className="small text-secondary">
                {String(arrCart.length).padStart(2, "0")} product
                {arrCart.length > 1 ? "s" : ""}
              </span>
            </div>

            {arrCart.map((item) => {
              return (
                <div
                  className="card border-0 shadow-sm rounded-4 mb-3"
                  key={item?.id}
                >
                  <div className="card-body p-3 p-md-4">
                    <div className="row align-items-center g-3">
                      <div className="col-4 col-md-3">
                        <div className="bg-body-tertiary rounded-3 p-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid"
                          />
                        </div>
                      </div>

                      <div className="col-8 col-md-4">
                        <span className="small text-secondary">
                          GRED / {String(item.id).padStart(2, "0")}
                        </span>

                        <h3 className="h5 fw-bold mb-1 text-capitalize">
                          {item.name}
                        </h3>

                        <p className="small text-secondary mb-2">
                          {item.categories} · Size {item.size}
                        </p>

                        <span className="badge text-bg-success">Available</span>
                      </div>

                      <div className="col-6 col-md-2">
                        <label
                          htmlFor="cartQty"
                          className="small fw-bold text-secondary text-uppercase"
                        >
                          Quantity
                        </label>

                        <div className="input-group mt-1">
                          <button
                            type="button"
                            className="btn btn-outline-secondary rounded-0 shadow-none px-2"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              dispatch(
                                changeQuantityRedux({
                                  id: item.id,
                                  size: item.size,
                                  quantity: -1,
                                }),
                              )
                            }
                          >
                            −
                          </button>

                          <span className="form-control text-center fw-bold rounded-0 px-0 border-start-0 border-end-0">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            className="btn btn-outline-secondary rounded-0 shadow-none px-2"
                            onClick={() =>
                              dispatch(
                                changeQuantityRedux({
                                  id: item.id,
                                  size: item.size,
                                  quantity: 1,
                                }),
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="col-6 col-md-3 text-md-end">
                        <div className="small text-secondary">Unit price</div>
                        <div className="h4 fw-bold mb-2">{item.price}$</div>
                        <div className="d-flex gap-2 justify-content-md-end">
                          <NavLink
                            to={`/detail-shoe/${item.id}`}
                            className="btn btn-sm btn-outline-dark rounded-0"
                          >
                            EDIT
                          </NavLink>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger rounded-0"
                            onClick={() => handleRemove(item)}
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <NavLink
              className="link-dark text-decoration-none fw-semibold small"
              to="/search-shoe"
            >
              <h5>← CONTINUE SHOPPING</h5>
            </NavLink>

            <div
              className="alert alert-light border mt-4 small mb-0"
              role="note"
            >
              <strong>Before you continue:</strong> Check the size and quantity
              of your selected item.
            </div>
          </div>

          <aside className="col-lg-4">
            <div className="card text-bg-dark border-0 rounded-4">
              <div className="card-body p-4 p-lg-4">
                <p className="small fw-bold text-warning text-uppercase mb-2">
                  THE TOTAL
                </p>

                <h2 className="h4 fw-bold text-uppercase mb-4">
                  Order summary
                </h2>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-white-50">Subtotal</span>
                  <span>{totalPrice}$</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-white-50">Shipping</span>
                  <span className="small">Calculated at checkout</span>
                </div>

                <hr className="border-secondary" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold">Total</span>
                  <span className="h3 fw-bold text-warning mb-0">
                    {totalPrice}$
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-warning btn-lg fw-bold rounded-0 w-100"
                  disabled={arrCart.length === 0}
                  onClick={handleSubmitOrder}
                >
                  SUBMIT ORDER ↗
                </button>

                <p className="small text-white-50 mt-3 mb-0">
                  You will be able to review your order details before
                  completion.
                </p>
              </div>
            </div>

            <div className="mt-3 p-3 border rounded-3">
              <div className="small fw-bold text-uppercase mb-1">
                Need help?
              </div>

              <a
                href="mailto:support@greedy.example"
                className="small text-secondary"
              >
                Contact customer support
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CartProduct;
