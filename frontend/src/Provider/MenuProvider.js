import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuUserContext from "../context/MenuUserContext";

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  return (
    <MenuUserContext.Provider value={{ menu, setMenu }}>
      {children}
    </MenuUserContext.Provider>
  );
};
