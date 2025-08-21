import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileModal from "../profile/profile"; // Adjust path if needed

const Navbar = () => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
  
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const backendUrl = 'http://localhost:8000';

  useEffect(() => {
    if (user && user.image) {
      const correctedPath = user.image.replace(/\\/g, '/').replace('public/', '');
      setUserAvatar(`${backendUrl}/${correctedPath}`);
    } else {
      setUserAvatar('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
    }
  }, [user]); 

  const toggleProfileModal = () => {
    setProfileModalOpen(!isProfileModalOpen);
  };

  return (
    <>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 20px",
        backgroundColor: "rgba(97, 97, 97, 1)",
        color: "white"
      }}>
        <h2>MyApp</h2>
        <div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img 
                src={userAvatar} 
                alt="profile" 
                style={{ height: "30px", width: "30px", borderRadius: "50%", objectFit: "cover" }}
                onError={(e) => { e.target.onerror = null; e.target.src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; }}
              />
              <div 
                onClick={toggleProfileModal} 
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                {user.first_name}
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ color: "white", marginRight: "10px" }}>Login</Link>
              <Link to="/signup" style={{ color: "white" }}>Signup</Link>
            </>
          )}
        </div>
      </nav>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
