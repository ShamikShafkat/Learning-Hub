import { Route, Routes } from "react-router-dom";
import Password from "../Profile/Password";
import Profile from "../Profile/Profile";
import { MenuProvider } from "../Provider/MenuProvider";
import { AuthRoutes } from "./AuthRoutes";
import { useUser } from "../Provider/UserProvider";
import { useEffect } from "react";

export const ProtectedRoutes = () => {

  return (
    <MenuProvider>
      <AuthRoutes>
        <Routes>
          <Route path="/password" element={<Password />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AuthRoutes>
    </MenuProvider>
  );
};
