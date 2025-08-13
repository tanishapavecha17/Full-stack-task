const jwt = require("jsonwebtoken");
const userService = require("../../services/userService");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.verifyUserLogin(email, password);
    const token = jwt.sign(
      {
        id:user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        // id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {console.error('Login error:', error);
    
    if (error.message.includes("Invalid") || error.message.includes("Please complete")) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = loginUser;