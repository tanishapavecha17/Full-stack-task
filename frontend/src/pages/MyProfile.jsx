import React, { useState, useEffect } from "react";
import "./MyProfile.css";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const backendUrl = "http://localhost:8000";

  const getImageUrl = (path) => {
    if (!path)
      return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    const correctedPath = path.replace(/\\/g, "/").replace("public/", "");
    return `${backendUrl}/${correctedPath}`;
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        first_name: storedUser.first_name || "",
        last_name: storedUser.last_name || "",
        email: storedUser.email || "",
      });
      setImagePreview(getImageUrl(storedUser.image));
    }
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
    if (isEditing && user) {
      setImagePreview(getImageUrl(user.image));
      setImageFile(null);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const submissionData = new FormData();
    submissionData.append("first_name", formData.first_name);
    submissionData.append("last_name", formData.last_name);
    submissionData.append("email", formData.email);
    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:8000/api/users/me/edit",
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data;

      setUser(responseData.data);
      localStorage.setItem("user", JSON.stringify(responseData.data));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setImageFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-summary-card">
          <img
            src={imagePreview}
            alt="Profile"
            className="profile-picture"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
            }}
          />
          <div className="summary-info">
            <h2>{`${user.first_name || ""} ${user.last_name || ""}`}</h2>
            <p>{user.role}</p>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-details-card">
          <div className="card-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button onClick={handleEditToggle} className="edit-button">
                Edit
              </button>
            )}
          </div>

          {error && <p className="message error-message">{error}</p>}
          {success && <p className="message success-message">{success}</p>}

          {isEditing ? (
            <form onSubmit={handleSaveChanges}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Profile Photo</label>
                  <label htmlFor="image-upload" className="custom-file-upload">
                    Change Photo
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="details-grid">
              <div className="detail-item">
                <p>First Name</p>
                <strong>{user.first_name}</strong>
              </div>
              <div className="detail-item">
                <p>Last Name</p>
                <strong>{user.last_name}</strong>
              </div>
              <div className="detail-item">
                <p>Email Address</p>
                <strong>{user.email}</strong>
              </div>
              <div className="detail-item">
                <p>User Role</p>
                <strong>{user.role}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyProfile;
