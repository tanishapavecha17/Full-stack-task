import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./ContextProvider";

const PrivateRoute = ({ children, roles }) => {
  const { role, authenticated } = useContext(UserContext);

  if (!authenticated) {
    console.log("fhff");    
    return <Navigate to='/login' />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to='/unauthorized' />;
  }

  return children;
};

export default PrivateRoute;