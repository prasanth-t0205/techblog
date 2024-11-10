import React from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Header />
      <main className="flex-grow px-5">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
