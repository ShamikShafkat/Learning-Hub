import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import { useEffect } from "react";
import Loading from "../components/loading";
import axios from "axios";
import { useState } from "react";
import Login from "../Auth/Login/login";
import Signup from "../Auth/Signup/Signup";
import { AuthProvider } from "../Provider/AuthProvider";
import { useUser } from "../Provider/UserProvider";
import Password from "../Profile/Password";
import Profile from "../Profile/Profile";
import { AuthRoutes } from "./AuthRoutes";
import { MenuProvider } from "../Provider/MenuProvider";
import { ProtectedRoutes } from "./ProtectedRoutes";

function Root() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default Root;
