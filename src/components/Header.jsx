// import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/img/logo.png";
import useCategory from "../customhooks/useCategory";
import useRedux from "../customhooks/useRedux";

const Header = () => {
  const { activeCategory, categoryClass } = useCategory({
    baseClassName: "nav-link px-lg-3",
    activeClassName: "fw-semibold text-warning",
    inactiveClassName: "text-secondary",
  });

  const { rootState } = useRedux();
  const arrCart = rootState.cartReducer.arrCart;
  const totalQuantity = arrCart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="bg-warning text-dark py-2 text-center small fw-bold text-uppercase">
        <div className="container-xl">
          THE NEW STANDARD OF EVERYDAY MOVEMENT{" "}
          <span className="d-none d-sm-inline">
            &nbsp; • &nbsp; FEATURED DROP — PREMIUM FOOTWEAR
          </span>
        </div>
      </div>

      <header className="sticky-top">
        <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-warning border-opacity-50 py-3">
          <div className="container-xl">
            <NavLink className="navbar-brand me-lg-5" to="/">
              <img
                src={logo}
                width={200}
                height={200}
                className="img-fluid"
                alt="logo"
              />
            </NavLink>

            <button
              className="navbar-toggler border-secondary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavigation"
              aria-controls="mainNavigation"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="mainNavigation">
              <ul className="navbar-nav me-auto mb-3 mb-lg-0">
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link px-lg-3 fw-semibold text-warning"
                        : "nav-link"
                    }
                    aria-current="page"
                    to="/"
                  >
                    Home
                  </NavLink>
                </li>

                <li className="nav-item">
                  <Link
                    className={categoryClass("men")}
                    to="/search-shoe?category=men"
                  >
                    Men
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={categoryClass("women")}
                    to="/search-shoe?category=women"
                  >
                    Women
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={categoryClass("kids")}
                    to="/search-shoe?category=kids"
                  >
                    Kids
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={categoryClass("sport")}
                    to="/search-shoe?category=sport"
                  >
                    Sport
                  </Link>
                </li>
              </ul>
              <div className="d-flex align-items-center gap-3">
                <NavLink
                  className="text-white text-decoration-none fw-semibold"
                  to="/search-shoe"
                >
                  <span className="fs-5">⌕</span>
                  <span className="d-none d-xl-inline ms-1 small">SEARCH</span>
                </NavLink>

                <NavLink
                  className="text-white text-decoration-none fw-semibold"
                  to="/cart-shoe"
                >
                  <span className="fs-5">
                    <i className="fa-solid fa-cart-shopping" />
                  </span>

                  {totalQuantity > 0 && (
                    <span className="small">
                      {" "}
                      <span className="badge rounded-pill text-bg-warning text-dark">
                        {totalQuantity}
                      </span>
                    </span>
                  )}
                </NavLink>

                <NavLink
                  className="text-white-50 text-decoration-none small d-none d-lg-inline"
                  to="/login"
                >
                  LOGIN
                </NavLink>

                <NavLink
                  className="btn btn-warning btn-sm fw-bold rounded-0 px-3"
                  to="/register"
                >
                  JOIN US
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
