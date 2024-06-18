import React, { useEffect, useState } from "react";
import axios from "axios";
import { createContext, useContext } from "react";
import { useUser } from "./UserProvider";

const MenuUserContext = createContext();

export const useMenu = () => {
  return useContext(MenuUserContext);
};

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState(null);
  const { user } = useUser();

  return (
    <MenuUserContext.Provider value={{ menu, setMenu }}>
      {children}
    </MenuUserContext.Provider>
  );
};
