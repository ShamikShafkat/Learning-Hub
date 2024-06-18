import { Route, Routes } from "react-router-dom";
import Password from "../Profile/Password";
import Profile from "../Profile/Profile";
import { MenuProvider } from "../Provider/MenuProvider";
import { AuthRoutes } from "./AuthRoutes";
import { useUser } from "../Provider/UserProvider";
import { useEffect } from "react";
import AdminRoot from "../Admin/RouteAdmin/AdminRoot";
import AllCourse from "../Admin/Course/AllCourse";
import EnrollCourse from "../components/Users/EnrollCourse";
import Course from "../components/Users/Course";
import Enroll from "../components/Users/Enrolled";

const RoleBasedRoutes = (role) => {
  return (
    <Routes>
      {role.role === "ADMIN" ? (
        <Route path="/*" element={<AdminRoot />} />
      ) : (
        <>
          <Route path="/profile" element={<Profile />} />
          <Route path="/password" element={<Password />} />

          <Route path="/courses" element={<AllCourse />} />
          <Route path="/enroll_course/:id" element={<EnrollCourse />} />
          <Route path="/course/:id" element={<Course />} />
          <Route path="/enrolled" element={<Enroll />} />
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
