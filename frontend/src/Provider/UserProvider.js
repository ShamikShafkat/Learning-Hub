import React, { useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };
  if (!user) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setUser({ accessToken: accessToken });
    }
  }
  const fetchUser = async () => {
    if (user && !user.name) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          await axios
            .get("http://localhost:8000/users/profile/", {
              headers: {
                accessToken: accessToken,
              },
            })
            .then((res) => {
              const data = res.data.data[0];
              const d = Object.assign(data, {
                accessToken: accessToken,
              });
              setUser(d);
              console.log(d);
            });
        } catch (error) {
          const res = error.response.status;
          if (res === 401) {
            localStorage.removeItem("accessToken");
            logout();
          } else {
          }
          console.log(error);
        }
      }
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
