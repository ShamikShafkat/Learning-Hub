import { createContext, useContext } from "react";

const MenuUserContext = createContext(); 

export const useMenu = () => {
  return useContext(MenuUserContext);
};
export default MenuUserContext;
