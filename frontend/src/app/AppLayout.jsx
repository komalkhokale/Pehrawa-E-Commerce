import React from "react";
import Nav from "../features/Shared/Components/Nav";
import Footer from "../features/Shared/Components/Footer";
import { Outlet } from "react-router-dom";
import PageTransition from "./PageTransition";

const AppLayout = () => {
  return (
    <>
     <PageTransition />
      <Nav />


      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default AppLayout;
