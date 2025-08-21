import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';
import axios from 'axios';
import "./auth.css";

function Signup() {
  const [signUpInfo, setSignUpInfo] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpInfo({
      ...signUpInfo,
      [name]: value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email } = signUpInfo;

    if (!first_name || !last_name || !email) {
      return handleError("All fields are required");
    }

    setIsLoading(true);

    try {
      const url = "http://localhost:8000/api/users/signup";
      
     
      const response = await axios.post(url, signUpInfo, {
        withCredentials: true 
      });

      const result = response.data;
      console.log(result);

      if (response.status === 201) {
        handleSuccess("Signup successful! Please check your email to set your password.");
        setSignUpInfo({
          first_name: "",
          last_name: "",
          email: ""
        });
        
        setTimeout(() => {
          Navigate('/login');
        }, 2000);
      }
    } catch (err) {
      handleError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='cmain'>
      <div className='container'>
        <h2>Signup</h2>
        <form onSubmit={handleSignUp}>
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="first_name"
              placeholder='Enter your first name'
              value={signUpInfo.first_name}
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="last_name">Last Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="last_name"
              placeholder='Enter your last name'
              value={signUpInfo.last_name}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder='Enter your email'
              value={signUpInfo.email}
              disabled={isLoading}
            />
          </div>

          <button type='submit' disabled={isLoading}>
            {isLoading ? "Signing up..." : "Signup"}
          </button>

          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}

export default Signup;
