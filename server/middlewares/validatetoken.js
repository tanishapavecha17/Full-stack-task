
const jwt = require("jsonwebtoken");


const validateToken = (req, res, next) => {  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized, token missing or malformed" 
    });
  }

  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Token is missing from the authorization header.",
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (err) {
    console.error("JWT validation failed:", err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
        error: "TokenExpiredError",
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Invalid token. You are not authorized.",
      error: "JsonWebTokenError",
    });
  }
};

module.exports = validateToken;

