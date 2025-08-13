const validateAdmin = (req, res, next) => {
  try {
    // Check if user exists 
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Check if user has admin role
    if (!req.user.role || req.user.role.trim() !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }

    next();
  } catch (err) {
    console.error("Admin validation failed:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error validating admin privileges"
    });
  }
};


module.exports = validateAdmin;
