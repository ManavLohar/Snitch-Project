import React from "react";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useDispatch } from "react-redux";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
