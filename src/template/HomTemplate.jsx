// import React from "react";

import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";

const HomTemplate = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default HomTemplate;
