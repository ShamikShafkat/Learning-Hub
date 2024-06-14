import React, { useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  if (!user || !user.accessToken) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) login({ accessToken: accessToken });
  }
  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
