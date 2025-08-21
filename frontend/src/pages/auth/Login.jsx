import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError } from "../../utils";
import axios from 'axios'; 
import './auth.css';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("All fields are required");
    }

    setIsLoading(true);

    try {
      const url = "http://localhost:8000/api/users/login";
      const response = await axios.post(url, loginInfo, {
        withCredentials: true 
      });
      
      const result = response.data;
      console.log(result);

      if (response.status === 200) {
        console.log("Login successful!");
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("role", JSON.stringify(result.user.role));
        navigate("/home");
      } else if (response.status === 201) {
        console.log("User needs to set password!");
        navigate("/setpassword");
      }
    } catch (err) {

      handleError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cmain">
      <div className="container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginInfo.email}
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginInfo.password}
              disabled={isLoading}
            />
          </div>

          <span>
            <Link to="/setpassword">Forgot password?</Link>
          </span>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <span>
            New User? <Link to="/signup">SignUp</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
