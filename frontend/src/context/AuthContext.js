import React, { createContext, useContext, useState } from "react";

// Create a context for authentication
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
