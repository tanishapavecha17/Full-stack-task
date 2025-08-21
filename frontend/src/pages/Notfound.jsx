import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "8rem",
          fontWeight: "900",
          color: "#e63946",
          margin: "0",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#333",
          marginTop: "10px",
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          fontSize: "1rem",
          color: "#666",
          margin: "15px 0 30px",
        }}
      >
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/home"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#007bff",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: "600",
          borderRadius: "6px",
          textDecoration: "none",
          transition: "background 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
