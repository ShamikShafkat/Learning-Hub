import React, { createContext, useContext, useState } from "react";

// Create a Context for the user
const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export default UserContext;
