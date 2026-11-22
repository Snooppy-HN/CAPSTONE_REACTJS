// import React from "react";
import { NavLink } from "react-router-dom";
import useRedux from "../customhooks/useRedux";
import {
  getAPIShoeReducer,
  getAllCategoryReducer,
  getShoeSizes,
  getShoeCategories,
} from "../redux/reducer/productReducer";
import { useEffect, useMemo, useState } from "react";
import orderBy from "lodash/orderBy";
import useFavorite from "../customhooks/useFavorite";

const arrBagde = ["FEATURED", "THE ORIGINAL", "ON REPEAT"];

const arrSize = [
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
];

const SHOES_PER_PAGE = 9;

const SearchPage = () => {
  const { rootState, dispatch } = useRedux();
  const { isFavorite, toggleFavorite } = useFavorite();

  const arrShoe = rootState.productReducer.arrShoe || [];
  const arrShoeAll = rootState.productReducer.arrShoeAll || [];
  const arrCategory = rootState.productReducer.arrCategory || [];
  const allShoes = arrShoeAll.length > 0 ? arrShoeAll : arrShoe;

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [sortType, setSortType] = useState("featured");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    dispatch(getAPIShoeReducer());
    dispatch(getAllCategoryReducer());
  }, [dispatch]);

  const handleSearch = (event) => {
    event.preventDefault();

    setSearchKeyword(searchInput.trim());
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;

    setSelectedCategory(categoryId);
  };

  const handleReset = async () => {
    setSearchInput("");
    setSearchKeyword("");

    setSortType("featured");

    setSelectedCategory("");
    setSelectedSizes([]);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSizes) => {
      if (prevSizes.includes(size)) {
        return prevSizes.filter((item) => item !== size);
      }

      return [...prevSizes, size];
    });
  };

  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  const filteredShoes = useMemo(() => {
    let result = [...allShoes];

    if (selectedCategory) {
      result = result.filter((shoe) => {
        const categories = getShoeCategories(shoe);

        return categories.some((category) => {
          const categoryId =
            typeof category === "object"
              ? (category.id ?? category.category ?? category.alias)
              : category;

          return (
            String(categoryId ?? "")
              .trim()
              .toLowerCase() === String(selectedCategory).trim().toLowerCase()
          );
        });
      });
    }

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();

      result = result.filter((shoe) => {
        const shoeName = shoe.name?.toLowerCase() || "";

        const shoeDescription = shoe.shortDescription?.toLowerCase() || "";

        return shoeName.includes(keyword) || shoeDescription.includes(keyword);
      });
    }

    if (selectedSizes.length > 0) {
      result = result.filter((shoe) => {
        const shoeSizes = getShoeSizes(shoe.size);

        return selectedSizes.some((size) => shoeSizes.includes(size));
      });
    }

    if (sortType === "price-asc") {
      result = orderBy(result, [(shoe) => Number(shoe.price)], ["asc"]);
    } else if (sortType === "price-desc") {
      result = orderBy(result, [(shoe) => Number(shoe.price)], ["desc"]);
    }

    return result;
  }, [allShoes, selectedCategory, searchKeyword, selectedSizes, sortType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredShoes.length / SHOES_PER_PAGE),
  );

  const safePage = Math.min(currentPage, totalPages);

  const pagedShoes = filteredShoes.slice(
    (safePage - 1) * SHOES_PER_PAGE,
    safePage * SHOES_PER_PAGE,
  );

  const handleChangePage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchKeyword, selectedSizes, sortType]);

  return (
    <main className="flex-grow-1">
      <section className="bg-black text-white py-5">
        <div className="container-xl py-lg-4">
          <div className="row align-items-end g-4">
            <div className="col-lg-6">
              <p className="small fw-bold text-warning text-uppercase mb-3">
                THE GREEDY SHOESHOP
              </p>

              <h1 className="display-2 fw-bolder text-uppercase lh-1 mb-0">
                Find your
                <br />
                <span className="text-warning">next pair.</span>
              </h1>
            </div>

            <div className="col-lg-6">
              <form
                className="bg-white p-2 d-flex gap-2"
                onSubmit={handleSearch}
              >
                <label className="visually-hidden" htmlFor="productSearch">
                  Search products
                </label>

                <input
                  id="productSearch"
                  name="search"
                  type="search"
                  className="form-control form-control-lg border-0 rounded-0"
                  placeholder="Search by product name..."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />

                <button
                  className="btn btn-warning fw-bold rounded-0 px-4"
                  type="submit"
                >
                  SEARCH ↗
                </button>
              </form>

              <p className="small text-white-50 mt-2 mb-0">
                Search the featured footwear collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-xl py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
          <div>
            <p className="small fw-bold text-warning text-uppercase mb-2">
              Browse / Discover
            </p>
            <h2 className="display-5 fw-bolder text-uppercase mb-0">
              Search result<span className="text-warning">.</span>
            </h2>
            <p className="text-secondary small mt-2 mb-0">
              GREEDY BRAND · FOOTWEAR CULTURE
            </p>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            <label
              className="small fw-semibold text-secondary"
              htmlFor="sortProducts"
            >
              SORT BY
            </label>

            <select
              id="sortProducts"
              className="form-select rounded-0 w-auto"
              value={sortType}
              onChange={handleSortChange}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>

        <div className="row g-4">
          <aside className="col-lg-3">
            <div className="border rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 fw-bold text-uppercase mb-0">
                  Filter selection
                </h3>

                <button
                  type="button"
                  className="btn btn-link btn-sm text-secondary p-0"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>

              <hr />

              <h4 className="small fw-bold text-uppercase mb-3">Category</h4>

              <select
                className="form-select rounded-0 mb-4"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All products</option>

                {arrCategory.map((category) => {
                  const categoryId =
                    typeof category === "string"
                      ? category
                      : (category?.id ?? category?.category ?? category?.alias);

                  const categoryName =
                    typeof category === "string"
                      ? category
                      : (category?.category ?? category?.alias ?? category?.id);

                  if (!categoryId) return null;

                  return (
                    <option key={String(categoryId)} value={String(categoryId)}>
                      {categoryName}
                    </option>
                  );
                })}
              </select>

              <hr />

              <h4 className="small fw-bold text-uppercase mb-3">
                Available size
              </h4>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {arrSize.map((size) => (
                  <div key={size}>
                    <input
                      className="btn-check"
                      type="checkbox"
                      id={`filter${size}`}
                      value={size}
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                    />

                    <label
                      className="btn btn-outline-dark btn-sm rounded-0"
                      htmlFor={`filter${size}`}
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>

              <hr />

              <h4 className="small fw-bold text-uppercase mb-2">Price</h4>

              <select
                className="form-select rounded-0"
                value={sortType}
                onChange={handleSortChange}
              >
                <option value="featured">Featured</option>

                <option value="price-asc">Price: low to high</option>

                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </aside>

          <div className="col-lg-9">
            <div className="row g-4">
              {pagedShoes.map((shoe, index) => {
                const badgeText = arrBagde[index % arrBagde.length];

                return (
                  <div className="col-12 col-sm-6 col-lg-4" key={shoe.id}>
                    <article className="card h-100 border-0 rounded-4 overflow-hidden shadow-sm">
                      <div className="position-relative bg-body-tertiary">
                        <NavLink
                          className="d-block p-3 p-lg-4"
                          aria-label={`View ${shoe.name}`}
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

            {totalPages > 1 && (
              <nav className="mt-5" aria-label="Search results pages">
                <ul className="pagination pagination-sm justify-content-center mb-0">
                  <li
                    className={`page-item ${safePage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link text-dark"
                      disabled={safePage === 1}
                      onClick={() => handleChangePage(safePage - 1)}
                    >
                      ←
                    </button>
                  </li>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
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
                            ? "bg-dark border-dark text-white"
                            : "text-dark"
                        }`}
                        onClick={() => handleChangePage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      safePage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link text-dark"
                      disabled={safePage === totalPages}
                      onClick={() => handleChangePage(safePage + 1)}
                    >
                      →
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SearchPage;
