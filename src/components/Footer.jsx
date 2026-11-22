// import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/img/logo.png";
import useCategory from "../customhooks/useCategory";

const Footer = () => {
  const { activeCategory, categoryClass } = useCategory({
    baseClassName: "link-underline-opacity-0 link-underline-opacity-75-hover",
    activeClassName: "link-light",
    inactiveClassName: "link-light",
  });

  return (
    <div>
      <footer className="bg-black text-white mt-auto">
        <div className="container-xl py-5">
          <div className="row g-4 g-lg-5">
            <div className="col-lg-4">
              <NavLink className="d-inline-block mb-3" to="/">
                <img src={logo} width={250} height={100} alt="logo" />
              </NavLink>

              <p className="text-white-50 small mb-4">
                A sharper point of view on everyday footwear. Find your pace.
                Make your move.
              </p>
              <span className="badge text-bg-warning text-dark rounded-0">
                MOVE DIFFERENT.
              </span>
            </div>
            <div className="col-6 col-lg-2">
              <h2 className="h6 fw-bold text-uppercase text-warning mb-3">
                Explore
              </h2>
              <ul className="list-unstyled small d-grid gap-2 mb-0">
                <li>
                  <NavLink
                    className="link-light link-underline-opacity-0 link-underline-opacity-75-hover"
                    to="/"
                  >
                    Home
                  </NavLink>
                </li>

                <li>
                  <Link
                    className={categoryClass("men")}
                    to="/search-shoe?category=men"
                  >
                    Men
                  </Link>
                </li>

                <li>
                  <NavLink
                    className={categoryClass("women")}
                    to="/search-shoe?category=women"
                  >
                    Women
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    className={categoryClass("kids")}
                    to="/search-shoe?category=kids"
                  >
                    Kids
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    className={categoryClass("sport")}
                    to="/search-shoe?category=sport"
                  >
                    Sport
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="col-6 col-lg-2">
              <h2 className="h6 fw-bold text-uppercase text-warning mb-3">
                Customer care
              </h2>
              <ul className="list-unstyled small d-grid gap-2 mb-0">
                <li>
                  <NavLink
                    className="link-light link-underline-opacity-0 link-underline-opacity-75-hover"
                    to="/profile"
                  >
                    My account
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    className="link-light link-underline-opacity-0 link-underline-opacity-75-hover"
                    to="/cart-shoe"
                  >
                    My bag
                  </NavLink>
                </li>

                <li>
                  <a
                    className="link-light link-underline-opacity-0 link-underline-opacity-75-hover"
                    href="mailto:support@greedy.example"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <NavLink
                    className="link-light link-underline-opacity-0 link-underline-opacity-75-hover"
                    to="/login"
                  >
                    Sign in
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h2 className="h6 fw-bold text-uppercase text-warning mb-3">
                Stay in motion
              </h2>
              <p className="text-white-50 small">
                Get product updates and first access to new drops.
              </p>
              <form action="/register" method="get" className="input-group">
                <label className="visually-hidden" htmlFor="footerEmail">
                  Email address
                </label>
                <input
                  id="footerEmail"
                  type="email"
                  className="form-control rounded-0"
                  placeholder="Your email address"
                  aria-label="Your email address"
                />
                <button
                  className="btn btn-warning fw-bold rounded-0"
                  type="submit"
                >
                  JOIN
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="border-top border-secondary border-opacity-50">
          <div className="container-xl py-3 d-flex flex-column flex-md-row justify-content-between gap-2 small text-white-50">
            <span>© 2026 GREEDY. ALL RIGHTS RESERVED.</span>
            <span>DESIGNED TO MOVE YOU FORWARD.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
