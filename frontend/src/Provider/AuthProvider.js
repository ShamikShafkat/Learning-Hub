import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserProvider";
import Loading from "../components/loading";
import NavBar from "../components/navbar";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const { user, setUser, flag } = useUser();
  const [Auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [user]);
  useEffect(() => {
    if (flag) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [flag]);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, loading }}>
      <header className="flex flex-col w-[100vw] justify-center items-center h-[20vh] z-50 fixed">
        <NavBar />
      </header>
      {loading ? <Loading show={loading} /> : children}
    </AuthContext.Provider>
  );
};
