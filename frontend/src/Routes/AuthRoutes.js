import { Link } from "@nextui-org/react";
import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../Provider/UserProvider";
import { useMenu } from "../Provider/MenuProvider";
import { useAuth } from "../Provider/AuthProvider";
import Loading from "../components/loading";

export const AuthRoutes = ({ children }) => {
  const { menu } = useMenu();
  const { user } = useUser();
  const { isAuth, loading } = useAuth();

  if (!isAuth) return <Navigate to="/login" />;

  return <>{children}</>;
};
