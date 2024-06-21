import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {useLocation} from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));
export const ScrollToTop = () => {
  
  const {pathname} = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};
setTimeout(() => {
  root.render(
    // <React.StrictMode>
     <App />
    // </React.StrictMode>
  );
}, 500);

