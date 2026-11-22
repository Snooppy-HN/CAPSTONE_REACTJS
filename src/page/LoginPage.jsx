import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import FacebookLogin from "@inkarnaterpg/react-facebook-login";
import useRedux from "../customhooks/useRedux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginApi, facebookLoginApi } from "../redux/reducer/userReducer";

const getApiErrorMessage = (error, defaultMessage) => {
  const apiMessage =
    error.response?.data?.message || error.response?.data?.content;

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  return error.message || defaultMessage;
};

const LoginPage = () => {
  const { dispatch } = useRedux();
  const navigate = useNavigate();
  const location = useLocation();

  const FormikLogin = useFormik({
    initialValues: {
      email: location.state?.email || "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .required("Email không được để trống")
        .email("Email không hợp lệ"),

      password: Yup.string().trim().required("Mật khẩu không được để trống"),
    }),

    onSubmit: async (values, { setStatus }) => {
      setStatus(null);

      const userData = {
        email: values.email.trim(),
        password: values.password,
      };

      try {
        const result = await dispatch(loginApi(userData));

        console.log("Đăng nhập thành công:", result);

        navigate("/profile", {
          replace: true,
        });
      } catch (error) {
        const errorMessage = getApiErrorMessage(
          error,
          "Đăng nhập thất bại. Vui lòng thử lại!",
        );

        setStatus({ error: errorMessage });

        console.log("Đăng ký thất bại:", errorMessage);
      }
    },
  });

  const responseFacebook = async (response) => {
    FormikLogin.setStatus(null);

    if (!response?.accessToken) {
      FormikLogin.setStatus({
        error:
          response?.status === "unknown"
            ? "Bạn chưa đăng nhập Facebook hoặc chưa cấp quyền."
            : "Không lấy được Facebook Access Token!",
      });

      return;
    }
    try {
      const result = await dispatch(facebookLoginApi(response.accessToken));

      console.log("Facebook Login thành công:", result);

      navigate("/profile", {
        replace: true,
      });
    } catch (error) {
      const errorMessage = getApiErrorMessage(
        error,
        "Đăng nhập Facebook thất bại!",
      );

      FormikLogin.setStatus({
        error: errorMessage,
      });

      console.log("Lỗi Facebook Login:", errorMessage);
    }
  };

  return (
    <main className="flex-grow-1 py-4 py-lg-5">
      <div className="container-xl">
        <div className="row g-0 rounded-5 overflow-hidden shadow-lg bg-white">
          <div className="col-lg-5 bg-black text-white p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <span className="badge text-bg-warning text-dark rounded-0 mb-4">
                GREEDY MEMBER
              </span>

              <p className="small fw-bold text-warning text-uppercase mb-3">
                GOOD TO HAVE YOU BACK
              </p>

              <h1 className="display-3 fw-bolder text-uppercase lh-1 mb-4">
                Pick up
                <br />
                where you
                <br />
                <span className="text-warning">left off.</span>
              </h1>

              <p className="text-white-50">
                Your account. Your orders. Your next favourite pair.
              </p>
            </div>

            <div className="mt-5 pt-4 border-top border-secondary">
              <div className="h4 fw-bold text-uppercase mb-1">
                MOVE DIFFERENT.
              </div>
              <p className="small text-white-50 mb-0">
                GREEDY / FOOTWEAR CULTURE
              </p>
            </div>
          </div>

          <div className="col-lg-7 p-4 p-md-5 p-xl-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <p className="small fw-bold text-warning text-uppercase mb-2">
                  ACCOUNT ACCESS
                </p>

                <h2 className="display-5 fw-bolder text-uppercase mb-0">
                  Sign in<span className="text-warning">.</span>
                </h2>
              </div>
            </div>

            <form onSubmit={FormikLogin.handleSubmit}>
              {location.state?.message && (
                <div className="alert alert-success rounded-0">
                  {location.state.message}
                </div>
              )}

              {FormikLogin.status?.error && (
                <div className="alert alert-danger rounded-0" role="alert">
                  {FormikLogin.status.error}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="form-label fw-bold small text-uppercase"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control form-control-lg rounded-0"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={FormikLogin.values.email}
                  onChange={FormikLogin.handleChange}
                  onBlur={FormikLogin.handleBlur}
                />

                {FormikLogin.touched.email && FormikLogin.errors.email && (
                  <p className="text text-danger">{FormikLogin.errors.email}</p>
                )}
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label
                    htmlFor="password"
                    className="form-label fw-bold small text-uppercase"
                  >
                    Password
                  </label>

                  <a
                    href="mailto:support@greedy.example?subject=Password%20help"
                    className="small text-secondary"
                  >
                    Forgot password?
                  </a>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control form-control-lg rounded-0"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={FormikLogin.values.password}
                  onChange={FormikLogin.handleChange}
                  onBlur={FormikLogin.handleBlur}
                />

                {FormikLogin.touched.password &&
                  FormikLogin.errors.password && (
                    <p className="text text-danger">
                      {FormikLogin.errors.password}
                    </p>
                  )}
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={false}
                  id="rememberMe"
                />
                <label
                  className="form-check-label small text-secondary"
                  htmlFor="rememberMe"
                >
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-warning btn-lg rounded-0 fw-bold w-100"
              >
                LOGIN TO YOUR ACCOUNT ↗
              </button>
            </form>

            <div className="d-flex align-items-center gap-3 my-4">
              <hr className="flex-grow-1" />
              <span className="small text-secondary">OR</span>
              <hr className="flex-grow-1" />
            </div>

            <FacebookLogin
              appId="1088597931155576"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              cssClass="btn btn-primary btn-lg rounded-0 w-100"
              textButton="Continue with Facebook"
              icon={<i className="fa-brands fa-facebook me-3 fs-4" />}
            />

            <p className="text-center small text-secondary mt-4 mb-0">
              New to GREEDY?{" "}
              <NavLink className="fw-bold text-dark" to="/register">
                Create an account
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
