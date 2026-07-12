import React from "react";
import { routes } from "./app.routes";
import { RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";
import Cursor from "./Cursor";



const App = () => {
  
  const { handleGetMe } = useAuth();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>
      <Cursor />
     
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
