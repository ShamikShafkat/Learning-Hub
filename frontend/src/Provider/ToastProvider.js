import React, { useEffect, useState } from "react";
import ToastContext from "../context/ToastContext";
import { toast, ToastContainer } from "react-toastify";

export const ToastProvider = ({ children }) => {
  const [Toast, setToast] = useState(null);
  const showToast = (message, type = "info") => {
    toast(message, { type });
  };
  return (
    <ToastContext.Provider value={showToast}>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      {children}
    </ToastContext.Provider>
  );
};
