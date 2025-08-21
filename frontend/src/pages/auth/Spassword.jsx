import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // make sure it's imported
import { handleError } from "../../utils"; // same as Login & Signup
import "./auth.css";

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // safely from query

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return handleError("Passwords do not match");
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/users/set-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        handleError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      handleError("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cmain">
      <div className="container">
        <h2>Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Set Password"}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}
