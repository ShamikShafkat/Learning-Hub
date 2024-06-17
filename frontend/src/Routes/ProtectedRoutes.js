import { Route, Routes } from "react-router-dom";
import Password from "../Profile/Password";
import Profile from "../Profile/Profile";
import { MenuProvider } from "../Provider/MenuProvider";
import { AuthRoutes } from "./AuthRoutes";
import { useUser } from "../Provider/UserProvider";
import { useEffect } from "react";
import AdminRoot from "../Admin/RouteAdmin/AdminRoot";

const RoleBasedRoutes = (role) => {
  console.log("RoleBasedRoutes", role.role);
  return (
    <Routes>
      {role.role === "ADMIN" ? (
        <Route path="/*" element={<AdminRoot />} />
      ) : (
        <>
          <Route path="/profile" element={<Profile />} />
          <Route path="/password" element={<Password />} />
        </>
      )}
    </Routes>
  );
};
export const ProtectedRoutes = () => {
  const { user } = useUser();
  return (
    <MenuProvider>
      <AuthRoutes>
        <Routes>
          <Route path="/*" element={<RoleBasedRoutes role={user?.role} />} />
        </Routes>
      </AuthRoutes>
    </MenuProvider>
  );
};
