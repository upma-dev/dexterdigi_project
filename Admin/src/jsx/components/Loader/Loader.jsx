import React from "react";
import "./Loader.css";

const Loader = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="custom-loader-container">
      <div className="custom-loader-content">
        <img
          src={require("../../../assets/images/loader.png")}
          alt="Logo"
          className="custom-loader-logo"
        />
        <div className="custom-loader-bar"></div>
      </div>
    </div>
  );
};

export default Loader;
