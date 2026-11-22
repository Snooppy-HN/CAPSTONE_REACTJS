import React, { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import useRedux from "../customhooks/useRedux";
import {
  getShoeDetailReducer,
  setSelectedSizeRedux,
  resetSelectedSizeRedux,
} from "../redux/reducer/productReducer";
import { addToCartRedux } from "../redux/reducer/cartReducer";
import useFavorite from "../customhooks/useFavorite";

const capitalizeWords = (text = "") =>
  text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const DetailProduct = () => {
  const params = useParams();

  const { rootState, dispatch } = useRedux();
  const { isFavorite, toggleFavorite } = useFavorite();
  const shoeDetail = rootState.productReducer.shoeDetail;
  const selectedSize = rootState.productReducer.selectedSize;

  const [quantity, setQuantity] = useState(1);

  const getDetail = async () => {
    dispatch(resetSelectedSizeRedux());
    dispatch(getShoeDetailReducer(params.id));
  };

  useEffect(() => {
    getDetail();
    setQuantity(1);
  }, [params.id]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!selectedSize) {
      alert("Vui lòng chọn size!");
      return;
    }

    dispatch(
      addToCartRedux({
        id: shoeDetail.id,
        name: shoeDetail.name,
        image: shoeDetail.image,
        price: shoeDetail.price,
        category: shoeDetail.categories?.[0]?.category,
        size: selectedSize,
        quantity: Number(quantity),
      }),
    );

    alert("Đã thêm vào giỏ hàng!");
  };

  const minSize = shoeDetail.size?.[0];
  const maxSize = shoeDetail.size?.[shoeDetail.size.length - 1];

  return (
    <main className="flex-grow-1">
      <div className="container-xl pt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb small mb-0">
            <li className="breadcrumb-item">
              <NavLink className="link-secondary" to="/">
                Home
              </NavLink>
            </li>

            <li className="breadcrumb-item">
              <NavLink className="link-secondary" to="/search-shoe">
                Collection
              </NavLink>
            </li>

            <li
              className="breadcrumb-item active text-capitalize"
              aria-current="page"
            >
              {shoeDetail.name}
            </li>
          </ol>
        </nav>
      </div>

      <section className="container-xl py-4 py-lg-5">
        <div className="row g-4 g-xl-5 align-items-center">
          <div className="col-lg-7">
            <div className="bg-body-tertiary rounded-5 p-3 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge text-bg-dark rounded-0">
                  GRED / {String(shoeDetail.id).padStart(2, "0")}
                </span>
                <span className="small text-secondary">GREEDY / FOOTWEAR</span>
              </div>

              <div className="ratio ratio-4x3">
                <img
                  src={shoeDetail.image}
                  alt={shoeDetail.name}
                  className="w-100 h-100 object-fit-contain"
                />
              </div>

              <div className="row g-2 mt-3">
                {shoeDetail.detaildetailedImages?.map((styleCSS) => {
                  return (
                    <div className="col-3" key={styleCSS}>
                      <div className="bg-white rounded-3 p-2 overflow-hidden">
                        <img
                          src={shoeDetail.image}
                          style={{ transform: styleCSS }}
                          alt="Ảnh thumbnail"
                          className="w-100 h-100 object-fit-contain"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge text-bg-warning text-dark rounded-0">
                FEATURED PAIR
              </span>

              <span className="small text-secondary">
                PRODUCT {String(shoeDetail.id).padStart(3, "0")}
              </span>
            </div>

            <p className="small fw-bold text-secondary text-uppercase mb-2">
              {shoeDetail.categories?.[0]?.category} / Originals
            </p>

            <h1 className="display-4 fw-bolder text-uppercase lh-1 mb-3">
              {capitalizeWords(shoeDetail.name)}
              <span className="text-warning">.</span>
            </h1>

            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge text-bg-light rounded-0">
                FEATURED PRODUCT
              </span>

              <span className="small text-secondary">
                GREEDY / {String(shoeDetail.id).padStart(3, "0")}
              </span>
            </div>

            <p className="text-secondary">{shoeDetail.shortDescription}</p>

            <div className="d-flex align-items-end gap-3 border-bottom pb-4 mb-4">
              <span className="display-5 fw-bold">{shoeDetail.price}$</span>
              <span className="small text-secondary mb-2">
                Price shown in the original design
              </span>
            </div>

            <form onSubmit={handleAddToCart}>
              <fieldset className="mb-4">
                <legend className="h6 fw-bold text-uppercase mb-3">
                  Select your size{" "}
                  <span className="text-secondary small fw-normal">(EU)</span>
                </legend>

                <div className="d-flex flex-wrap gap-2">
                  {shoeDetail.size?.map((size) => {
                    const sizeId = `size${size}`;

                    return (
                      <React.Fragment key={sizeId}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="size"
                          id={sizeId}
                          value={size}
                          checked={selectedSize === size}
                          onChange={() => dispatch(setSelectedSizeRedux(size))}
                        />

                        <label
                          htmlFor={sizeId}
                          className="btn btn-outline-dark rounded-0 px-3 py-2"
                        >
                          {size}
                        </label>
                      </React.Fragment>
                    );
                  })}
                </div>
              </fieldset>

              <div className="row g-2 align-items-end">
                <div className="col-4">
                  <label
                    htmlFor="quantity"
                    className="form-label small fw-bold text-uppercase"
                  >
                    Quantity
                  </label>

                  <div className="input-group input-group-lg">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-0 shadow-none"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>

                    <input
                      id="quantity"
                      className="form-control qty-input text-center fw-bold border-secondary rounded-0 border-start-0 border-end-0 shadow-none"
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Number(e.target.value) || 1))
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-0 shadow-none"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-8 d-grid">
                  <button
                    type="submit"
                    className="btn btn-warning btn-lg fw-bold rounded-0"
                  >
                    ADD TO BAG ↗
                  </button>
                </div>
              </div>
            </form>

            <div className="d-flex gap-3 small text-secondary mt-4">
              <span>♡ Save to favourites</span>
              <span>•</span>
              <span>In stock</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white py-5">
        <div className="container-xl">
          <div className="row g-4">
            <div className="col-md-4">
              <p className="text-warning small fw-bold text-uppercase mb-2">
                01 / The look
              </p>
              <h2 className="h4 fw-bold text-uppercase">Make a statement.</h2>
              <p className="text-white-50 small mb-0">
                A black-and-white palette gives the pair a strong, easy-to-style
                presence.
              </p>
            </div>
            <div className="col-md-4">
              <p className="text-warning small fw-bold text-uppercase mb-2">
                02 / The fit
              </p>
              <h2 className="h4 fw-bold text-uppercase">Find your size.</h2>
              <p className="text-white-50 small mb-0">
                {`Choose from the available sizes ${minSize} to ${maxSize}`}.
              </p>
            </div>
            <div className="col-md-4">
              <p className="text-warning small fw-bold text-uppercase mb-2">
                03 / Your next step
              </p>
              <h2 className="h4 fw-bold text-uppercase">Make it yours.</h2>
              <p className="text-white-50 small mb-0">
                Add the pair to your bag and review your selection before
                submitting an order.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-xl py-5 py-lg-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <p className="small text-warning fw-bold text-uppercase mb-2">
              Complete your rotation
            </p>
            <h2 className="display-5 fw-bolder text-uppercase mb-0">
              Related pairs<span className="text-warning">.</span>
            </h2>
          </div>

          <NavLink
            className="link-dark fw-bold text-decoration-none small"
            to="/search-shoe"
          >
            VIEW ALL ↗
          </NavLink>
        </div>

        <div className="row g-4">
          {shoeDetail.relatedProducts?.map((product) => {
            return (
              <div className="col-12 col-sm-6 col-lg-4" key={product?.id}>
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
                        />
                      </div>
                    </NavLink>

                    <span className="badge text-bg-dark rounded-0 position-absolute top-0 start-0 m-3">
                      RELATED
                    </span>

                    <button
                      type="button"
                      className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3"
                      aria-label={
                        isFavorite(product.id)
                          ? `Remove ${product.name} from favourites`
                          : `Save ${product.name} to favourites`
                      }
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <span
                        className={isFavorite(product.id) ? "text-danger" : ""}
                      >
                        {isFavorite(product.id) ? "♥" : "♡"}
                      </span>
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
                        className="link-dark text-decoration-none text-capitalize"
                        to={`/detail-shoe/${product.id}`}
                      >
                        {product.name}
                      </NavLink>
                    </h3>

                    <p className="small text-secondary mb-0">
                      {product.shortDescription
                        ? product.shortDescription.charAt(0).toUpperCase() +
                          product.shortDescription.slice(1)
                        : ""}
                    </p>
                  </div>

                  <div className="card-footer bg-white border-0 px-4 pb-4 pt-0">
                    <div className="d-flex justify-content-between align-items-center border-top pt-3">
                      <span className="h5 fw-bold mb-0">{product.price}$</span>

                      <Link
                        className="btn btn-dark rounded-0 px-4"
                        to={`/detail-shoe/${product.id}`}
                        onClick={() => {
                          if (product.id === shoeDetail.id) {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                      >
                        VIEW PAIR
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default DetailProduct;
