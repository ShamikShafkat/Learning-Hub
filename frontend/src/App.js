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
import { UserProvider, useUser } from "./Provider/UserProvider";
import Root from "./Routes/Root";
import { useAuth } from "./Provider/AuthProvider";
import { ToastContainer } from "react-toastify";

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

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <UserProvider>
        <Loading show={loading} />
        <Root />
      </UserProvider>
    </>
  );
}

export default App;
