import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Login from "./Auth/Login/login";
import Signup from "./Auth/Signup/Signup";
import Profile from "./Profile/Profile";
import Password from "./Profile/Password";
import { useEffect } from "react";
import Loading from "./components/loading";
import axios from "axios";
import { useState } from "react";
import { MenuProvider } from "./Provider/MenuProvider";
import { UserProvider } from "./Provider/UserProvider";

function App() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        setLoading(true);
        console.log("Request Interceptor:", config);
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (response) => {
        setLoading(false);
        console.log("Response Interceptor:", response);
        return response;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );
  }, []);

  const ProtectedRoutes = () => (
    <Routes>
      <Route path="/password" element={<Password />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );

  return (
    <BrowserRouter>
      <Loading show={loading} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
