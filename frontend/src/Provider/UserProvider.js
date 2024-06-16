import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

// Create a Context for the user
const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [flag, setFlag] = useState(false);

  const login = (userData) => {
    localStorage.setItem("accessToken", userData.accessToken);
    fetchUser();
  };

  const fetchUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !user) {
      try {
        await axios
          .get("http://localhost:8000/users/profile/", {
            headers: {
              accessToken: accessToken,
            },
          })
          .then((res) => {
            setFlag(true);
            const data = res.data.data[0];
            const d = Object.assign(data, {
              accessToken: accessToken,
            });
            setUser(d);
          });
      } catch (error) {
        setFlag(true);
        const res = error.response.status;
        if (res === 401) {
          localStorage.removeItem("accessToken");
          setUser(null);
        } else {
        }
        console.log(error);
      }
    } else {
      setFlag(true);
    }
  };
  const logout = async () => {
    try {
      localStorage.removeItem("accessToken");
      setUser(null);
      const res = await axios
        .post("http://localhost:8000/auth/logout/", {
          headers: {
            accessToken: user.accessToken,
          },
        })
        .then((res) => {
          toast.success("Logged out successfully");
          if (res.data.status === 200) {
            toast.success("Logged out successfully", {});

            logout();
          }
        });
    } catch (error) {
      const res = error.response.data;
      toast.error(res.message);
      logout();
      console.log(error);
    }
    console.log("logout", user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, login, fetchUser, flag, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
