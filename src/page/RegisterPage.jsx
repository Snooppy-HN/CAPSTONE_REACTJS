import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useRedux from "../customhooks/useRedux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerApi } from "../redux/reducer/userReducer";

const getApiErrorMessage = (error, defaultMessage) => {
  const apiMessage =
    error.response?.data?.message || error.response?.data?.content;

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  return error.message || defaultMessage;
};

const RegisterPage = () => {
  const { dispatch } = useRedux();

  const navigate = useNavigate();

  const FormikRegister = useFormik({
    initialValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      gender: null,
      phone: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .required("Email không được để trống")
        .email("Email không hợp lệ"),

      password: Yup.string()
        .trim()
        .required("Mật khẩu không được để trống")
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
          "Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
        ),

      passwordConfirm: Yup.string()
        .required("Vui lòng xác nhận mật khẩu")
        .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không trùng khớp"),

      name: Yup.string()
        .trim()
        .required("Họ tên không được để trống")
        .matches(
          /^(?!.*\d)(?!.* {2,})[\p{L}]+(?: [\p{L}]+)*$/u,
          "Họ tên phải là kí tự chữ",
        ),

      gender: Yup.boolean().nullable().required("Vui lòng chọn giới tính"),

      phone: Yup.string()
        .trim()
        .required("Số điện thoại không được để trống")
        .matches(
          /^(\+84|0)\d{9}$/,
          "Số điện thoại phải có 10 số và bắt đầu bằng số 0 hoặc +84",
        ),
    }),

    onSubmit: async (values, { setStatus, setFieldError }) => {
      setStatus(null);

      const userData = {
        email: values.email.trim(),
        password: values.password,
        name: values.name.trim(),
        gender: values.gender,
        phone: values.phone.trim(),
      };

      try {
        const result = await dispatch(registerApi(userData));

        console.log("Đăng ký thành công:", result);

        navigate("/login", {
          replace: true,
          state: {
            email: userData.email,
            message: "Đăng ký tài khoản thành công! Vui lòng đăng nhập.",
          },
        });
      } catch (error) {
        const errorMessage = getApiErrorMessage(
          error,
          "Đăng ký thất bại. Vui lòng thử lại!",
        );

        setStatus({ error: errorMessage });

        if (errorMessage.toLowerCase().includes("email")) {
          setFieldError("email", errorMessage);
        }

        console.log("Đăng ký thất bại:", errorMessage);
      }
    },
  });

  return (
    <main className="flex-grow-1 py-4 py-lg-5">
      <div className="container-xl">
        <div className="row g-0 rounded-5 overflow-hidden shadow-lg bg-white">
          <div className="col-lg-4 bg-warning text-dark p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <p className="small fw-bold text-uppercase mb-3">
                JOIN THE MOVEMENT
              </p>

              <h1 className="display-3 fw-bolder text-uppercase lh-1 mb-4">
                Make
                <br />
                room for
                <br />
                <span className="text-white">more.</span>
              </h1>
              <p className="text-dark-emphasis">
                Create your account to keep your details, orders and favourite
                products together.
              </p>
            </div>

            <div className="mt-5 pt-4 border-top border-dark border-opacity-25">
              <div className="h4 fw-bold text-uppercase mb-1">GREEDY</div>
              <p className="small mb-0">FIND YOUR OWN PACE.</p>
            </div>
          </div>

          <div className="col-lg-8 p-4 p-md-5">
            <div className="mb-4">
              <p className="small fw-bold text-warning text-uppercase mb-2">
                CREATE YOUR PROFILE
              </p>
              <h2 className="display-5 fw-bolder text-uppercase mb-1">
                Register<span className="text-warning">.</span>
              </h2>
              <p className="text-secondary">
                A few details and you're part of the movement.
              </p>
            </div>

            <form onSubmit={FormikRegister.handleSubmit}>
              {FormikRegister.status?.error && (
                <div className="alert alert-danger rounded-0" role="alert">
                  {FormikRegister.status.error}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    htmlFor="name"
                    className="form-label small fw-bold text-uppercase"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control form-control-lg rounded-0"
                    placeholder="Your full name"
                    autoComplete="name"
                    value={FormikRegister.values.name}
                    onChange={FormikRegister.handleChange}
                    onBlur={FormikRegister.handleBlur}
                  />

                  {FormikRegister.touched.name &&
                    FormikRegister.errors.name && (
                      <p className="text text-danger">
                        {FormikRegister.errors.name}
                      </p>
                    )}
                </div>

                <div className="col-md-6">
                  <label
                    htmlFor="phone"
                    className="form-label small fw-bold text-uppercase"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control form-control-lg rounded-0"
                    placeholder="Phone number"
                    autoComplete="tel"
                    value={FormikRegister.values.phone}
                    onChange={FormikRegister.handleChange}
                    onBlur={FormikRegister.handleBlur}
                  />

                  {FormikRegister.touched.phone &&
                    FormikRegister.errors.phone && (
                      <p className="text text-danger">
                        {FormikRegister.errors.phone}
                      </p>
                    )}
                </div>

                <div className="col-12">
                  <label
                    htmlFor="email"
                    className="form-label small fw-bold text-uppercase"
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
                    value={FormikRegister.values.email}
                    onChange={FormikRegister.handleChange}
                    onBlur={FormikRegister.handleBlur}
                  />

                  {FormikRegister.touched.email &&
                    FormikRegister.errors.email && (
                      <p className="text text-danger">
                        {FormikRegister.errors.email}
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
                    className="form-control form-control-lg rounded-0"
                    placeholder="Create a password"
                    value={FormikRegister.values.password}
                    onChange={FormikRegister.handleChange}
                    onBlur={FormikRegister.handleBlur}
                  />

                  {FormikRegister.touched.password &&
                    FormikRegister.errors.password && (
                      <p className="text text-danger">
                        {FormikRegister.errors.password}
                      </p>
                    )}
                </div>

                <div className="col-md-6">
                  <label
                    htmlFor="passwordConfirm"
                    className="form-label small fw-bold text-uppercase"
                  >
                    Confirm password
                  </label>

                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    className="form-control form-control-lg rounded-0"
                    placeholder="Repeat your password"
                    value={FormikRegister.values.passwordConfirm}
                    onChange={FormikRegister.handleChange}
                    onBlur={FormikRegister.handleBlur}
                  />

                  {FormikRegister.touched.passwordConfirm &&
                    FormikRegister.errors.passwordConfirm && (
                      <p className="text text-danger">
                        {FormikRegister.errors.passwordConfirm}
                      </p>
                    )}
                </div>

                <div className="col-12">
                  <fieldset>
                    <legend className="form-label small fw-bold text-uppercase mb-2">
                      Gender
                    </legend>

                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="genderMale"
                          checked={FormikRegister.values.gender === true}
                          onChange={() =>
                            FormikRegister.setFieldValue("gender", true)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="genderMale"
                        >
                          Male
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="genderFemale"
                          checked={FormikRegister.values.gender === false}
                          onChange={() =>
                            FormikRegister.setFieldValue("gender", false)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="genderFemale"
                        >
                          Female
                        </label>
                      </div>
                    </div>

                    {FormikRegister.touched.gender &&
                      FormikRegister.errors.gender && (
                        <p className="text text-danger">
                          {FormikRegister.errors.gender}
                        </p>
                      )}
                  </fieldset>
                </div>

                <div className="col-12 pt-3">
                  <button
                    type="submit"
                    className="btn btn-dark btn-lg rounded-0 fw-bold w-100"
                  >
                    CREATE MY ACCOUNT ↗
                  </button>
                </div>
              </div>
            </form>

            <p className="text-center small text-secondary mt-4 mb-0">
              Already have an account?{" "}
              <NavLink className="fw-bold text-dark" to="/login">
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
