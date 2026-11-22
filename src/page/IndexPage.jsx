// import React from "react";
import { Link, NavLink } from "react-router-dom";
import useRedux from "../customhooks/useRedux";
import { getAPIShoeReducer } from "../redux/reducer/productReducer";
import { useEffect } from "react";
import useCategory from "../customhooks/useCategory";
import useFavorite from "../customhooks/useFavorite";

const arrBagde = ["FEATURED", "THE ORIGINAL", "ON REPEAT"];

const IndexPage = () => {
  const { activeCategory, categoryClass } = useCategory({
    baseClassName: "card rounded-4 h-100",
    activeClassName: "text-decoration-none",
    inactiveClassName: "text-decoration-none",
  });

  const { rootState, dispatch } = useRedux();
  const { isFavorite, toggleFavorite } = useFavorite();
  const arrShoe = rootState.productReducer.arrShoe;
  const featuredShoes = arrShoe.slice(0, 3);

  const getAllProductAPI = async () => {
    dispatch(getAPIShoeReducer());
  };

  useEffect(() => {
    getAllProductAPI();
  }, []);

  return (
    <div className="flex-grow-1">
      <section className="bg-black text-white overflow-hidden">
        <div className="container-xl py-4 py-lg-5">
          <div
            id="greedyHeroCarousel"
            className="carousel slide"
            data-bs-interval="false"
          >
            {featuredShoes.length > 0 ? (
              <>
                <div className="carousel-inner">
                  {featuredShoes.map((shoe, index) => {
                    const name = shoe.name
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ");

                    return (
                      <div
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                        key={shoe.id}
                      >
                        <div className="row align-items-stretch g-4 g-xl-5 py-lg-4">
                          <div className="col-lg-5 py-3 py-lg-4">
                            <div className="d-flex align-items-center gap-2 mb-4">
                              <span className="badge text-bg-warning text-dark rounded-0">
                                DROP {String(shoe.id).padStart(3, "0")}
                              </span>

                              <span className="small text-white-50 text-uppercase">
                                The featured pair
                              </span>
                            </div>

                            <p className="text-warning fw-bold text-uppercase small mb-3">
                              GREEDY / FOOTWEAR CULTURE
                            </p>

                            <h1 className="display-1 fw-bolder text-uppercase lh-1 mb-4">
                              Move
                              <br />
                              your
                              <br />
                              <span className="text-warning">own way.</span>
                            </h1>

                            <p className="lead text-white-50 mb-4">
                              Meet the {name}. A bold silhouette for people who
                              never move on autopilot.
                            </p>

                            <div className="d-flex flex-wrap align-items-center gap-3">
                              <NavLink
                                className="btn btn-warning btn-lg rounded-0 fw-bold px-4"
                                to={`/detail-shoe/${shoe.id}`}
                              >
                                DISCOVER THE PAIR
                                <span aria-hidden="true"> ↗</span>
                              </NavLink>

                              <NavLink
                                className="link-light link-underline-opacity-0 link-underline-opacity-75-hover small fw-semibold"
                                to="/search-shoe"
                              >
                                EXPLORE COLLECTIONS
                              </NavLink>
                            </div>

                            <div className="d-flex gap-4 mt-5 pt-3 border-top border-secondary border-opacity-50">
                              <div>
                                <div className="h3 fw-bold mb-0">
                                  {String(shoe.id).padStart(2, "0")}
                                </div>

                                <div className="small text-white-50 text-uppercase">
                                  Featured drop
                                </div>
                              </div>

                              <div>
                                <div className="h3 fw-bold mb-0">32-35</div>

                                <div className="small text-white-50 text-uppercase">
                                  Available sizes
                                </div>
                              </div>

                              <div>
                                <div className="h3 fw-bold mb-0">
                                  {shoe.price}$
                                </div>

                                <div className="small text-white-50 text-uppercase">
                                  Starting price
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-7">
                            <div className="bg-body-tertiary rounded-5 p-3 p-md-4 p-lg-5 h-100 text-dark">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="small fw-bold text-uppercase">
                                  {shoe.name} /{" "}
                                  {String(shoe.id).padStart(2, "0")}
                                </span>

                                <span className="badge text-bg-warning text-dark rounded-0">
                                  NEW FOCUS
                                </span>
                              </div>

                              <div className="ratio ratio-4x3">
                                <img
                                  src={shoe.image}
                                  className="w-100 h-100 object-fit-contain"
                                  alt={shoe.name}
                                />
                              </div>

                              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                <span className="small text-secondary text-uppercase">
                                  GREEDY / FOOTWEAR
                                </span>

                                <NavLink
                                  className="link-dark fw-bold text-decoration-none text-uppercase"
                                  to={`/detail-shoe/${shoe.id}`}
                                >
                                  MEET THE {shoe.name}
                                  <span aria-hidden="true"> ↗</span>
                                </NavLink>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {featuredShoes.length > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                    <button
                      className="btn btn-outline-light rounded-0"
                      type="button"
                      data-bs-target="#greedyHeroCarousel"
                      data-bs-slide="prev"
                      aria-label="Previous product"
                    >
                      ←
                    </button>

                    <div className="carousel-indicators position-static m-0">
                      {featuredShoes.map((shoe, index) => (
                        <button
                          key={shoe.id}
                          type="button"
                          data-bs-target="#greedyHeroCarousel"
                          data-bs-slide-to={index}
                          className={index === 0 ? "active" : ""}
                          aria-label={`Slide ${index + 1}`}
                          aria-current={index === 0 ? "true" : undefined}
                        />
                      ))}
                    </div>

                    <button
                      className="btn btn-warning rounded-0"
                      type="button"
                      data-bs-target="#greedyHeroCarousel"
                      data-bs-slide="next"
                      aria-label="Next product"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-bottom">
        <div className="container-xl py-4">
          <div className="row g-3 text-center text-md-start">
            <div className="col-6 col-md-3">
              <div className="small fw-bold text-uppercase">
                01 — Find your fit
              </div>
              <div className="small text-secondary">Explore the collection</div>
            </div>

            <div className="col-6 col-md-3">
              <div className="small fw-bold text-uppercase">
                02 — Pick your size
              </div>
              <div className="small text-secondary">Sizes 38 to 42</div>
            </div>

            <div className="col-6 col-md-3">
              <div className="small fw-bold text-uppercase">
                03 — Make it yours
              </div>
              <div className="small text-secondary">Save your favourites</div>
            </div>

            <div className="col-6 col-md-3">
              <div className="small fw-bold text-uppercase">04 — Check out</div>
              <div className="small text-secondary">Review your bag</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-xl py-5 py-lg-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 mb-lg-5">
          <div>
            <p className="small fw-bold text-warning text-uppercase mb-2">
              Choose your direction
            </p>

            <h2 className="display-4 fw-bolder text-uppercase mb-0">
              Shop by <span className="text-secondary">mood.</span>
            </h2>
          </div>
          <p className="text-secondary mb-1">
            One destination. Different ways to move.
          </p>
        </div>

        <div className="row g-3">
          <div className="col-6 col-lg-3">
            <Link
              className={`${categoryClass("men")} text-bg-dark border-0`}
              to="/search-shoe?category=men"
            >
              <div className="card-body p-4 p-lg-5 d-flex flex-column justify-content-between">
                <span className="small text-warning fw-bold">
                  01 / COLLECTION
                </span>
                <div>
                  <h3 className="display-6 fw-bold text-uppercase mb-1">Men</h3>
                  <span className="small text-white-50">
                    Explore the edit ↗
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-6 col-lg-3">
            <Link
              className={`${categoryClass("women")} bg-warning text-dark border-0`}
              to="/search-shoe?category=women"
            >
              <div className="card-body p-4 p-lg-5 d-flex flex-column justify-content-between">
                <span className="small text-warning fw-bold">
                  02 / COLLECTION
                </span>
                <div>
                  <h3 className="display-6 fw-bold text-uppercase mb-1">
                    Women
                  </h3>
                  <span className="small text-white-50">
                    Explore the edit ↗
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-6 col-lg-3">
            <Link
              className={`${categoryClass("kids")} bg-body-tertiary text-dark border-0`}
              to="/search-shoe?category=kids"
            >
              <div className="card-body p-4 p-lg-5 d-flex flex-column justify-content-between">
                <span className="small text-warning fw-bold">
                  03 / COLLECTION
                </span>
                <div>
                  <h3 className="display-6 fw-bold text-uppercase mb-1">
                    Kids
                  </h3>
                  <span className="small text-white-50">
                    Explore the edit ↗
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-6 col-lg-3">
            <Link
              className={`${categoryClass("sport")} border border-2 border-dark`}
              to="/search-shoe?category=sport"
            >
              <div className="card-body p-4 p-lg-5 d-flex flex-column justify-content-between">
                <span className="small text-warning fw-bold">
                  04 / COLLECTION
                </span>
                <div>
                  <h3 className="display-6 fw-bold text-uppercase mb-1">
                    Sport
                  </h3>
                  <span className="small text-white-50">
                    Explore the edit ↗
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-body-tertiary py-5 py-lg-5">
        <div className="container-xl">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4 mb-lg-5">
            <div>
              <p className="small fw-bold text-warning text-uppercase mb-2">
                The current rotation
              </p>
              <h2 className="display-4 fw-bolder text-uppercase mb-0">
                Product <span className="text-secondary">feature.</span>
              </h2>
            </div>

            <NavLink
              className="btn btn-outline-dark rounded-0 fw-bold px-4"
              to="/search-shoe"
            >
              VIEW ALL PRODUCTS ↗
            </NavLink>
          </div>

          <div className="row g-4">
            {arrShoe.map((shoe, index) => {
              const badgeText = arrBagde[index % arrBagde.length];

              return (
                <div className="col-12 col-sm-6 col-lg-4" key={shoe.id}>
                  <article className="card h-100 border-0 rounded-4 overflow-hidden shadow-sm">
                    <div className="position-relative bg-body-tertiary">
                      <NavLink
                        className="d-block p-3 p-lg-4"
                        aria-label="View shoe"
                        to={`/detail-shoe/${shoe.id}`}
                      >
                        <div className="ratio ratio-4x3">
                          <img
                            src={shoe.image}
                            className="w-100 h-100 object-fit-contain"
                            alt={shoe.name}
                          />
                        </div>
                      </NavLink>

                      <span className="badge text-bg-dark rounded-0 position-absolute top-0 start-0 m-3">
                        {badgeText}
                      </span>

                      <button
                        type="button"
                        className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3"
                        aria-label={
                          isFavorite(shoe.id)
                            ? `Remove ${shoe.name} from favourites`
                            : `Save ${shoe.name} to favourites`
                        }
                        onClick={() => toggleFavorite(shoe.id)}
                      >
                        <span
                          className={isFavorite(shoe.id) ? "text-danger" : ""}
                        >
                          {isFavorite(shoe.id) ? "♥" : "♡"}
                        </span>
                      </button>
                    </div>

                    <div className="card-body px-4 pt-4 pb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-secondary small">
                          GRED / {String(shoe.id).padStart(2, "0")}
                        </span>

                        <span className="text-secondary small text-uppercase">
                          {shoe.name}
                        </span>
                      </div>

                      <h3 className="h5 fw-bold mb-1">
                        <NavLink
                          className="link-dark text-decoration-none text-capitalize"
                          to={`/detail-shoe/${shoe.id}`}
                        >
                          {shoe.name}
                        </NavLink>
                      </h3>

                      <p className="small text-secondary mb-0">
                        {shoe.shortDescription
                          ? shoe.shortDescription.charAt(0).toUpperCase() +
                            shoe.shortDescription.slice(1)
                          : ""}
                      </p>
                    </div>

                    <div className="card-footer bg-white border-0 px-4 pb-4 pt-0">
                      <div className="d-flex justify-content-between align-items-center border-top pt-3">
                        <span className="h5 fw-bold mb-0">{shoe.price}$</span>

                        <NavLink
                          className="btn btn-dark rounded-0 px-4"
                          to={`/detail-shoe/${shoe.id}`}
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

      <section className="container-xl py-5 py-lg-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <div className="bg-warning rounded-4 p-4 p-lg-5">
              <p className="small fw-bold text-uppercase mb-3">
                GREEDY / THE POINT OF VIEW
              </p>

              <h2 className="display-3 fw-bolder text-uppercase lh-1 mb-0">
                Less noise.
                <br />
                More
                <span className="text-white">movement.</span>
              </h2>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="ps-lg-4">
              <p className="text-secondary">
                Good footwear changes the way you show up. Start with a pair
                that feels like you, then take it somewhere new.
              </p>

              <NavLink
                className="btn btn-dark btn-lg rounded-0 px-4"
                to="/search-shoe"
              >
                FIND YOUR PAIR ↗
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndexPage;
