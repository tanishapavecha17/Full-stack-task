const userService = require("../../services/userService");

const setPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Token and password are required" 
      });
    }

    await userService.setUserPassword(token, password);

    res.status(200).json({ 
      success: true,
      message: "Password set successfully. You can now login." 
    });

  } catch (error) {
    console.error('Set password error:', error);
    
    if (error.message.includes("Invalid or expired token")) {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }

    res.status(500).json({ 
      success: false,
      message: error.message || "Internal server error" 
    });
  }
};

const resetpassword = async(req,res) => {
console.log();

}



module.exports = {setPassword,resetpassword};