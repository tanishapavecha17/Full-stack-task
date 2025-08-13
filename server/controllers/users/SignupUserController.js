// const userService = require("../services/userService");
// const sendEmail = require("../utils/sendEmail");

// const SignUserController = async (req, res) => {
//   try {
//     const { first_name, last_name, email } = req.body;

//     const existingUser = await userService.findUserByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists"
//       });
//     }

//     const { user, token } = await userService.createUser({
//       first_name,
//       last_name,
//       email
//     });

//     const setPasswordLink = `${process.env.CLIENT_URL}/api/set-password/${token}`;;
//     const emailContent = `
//       <h3>Hello ${first_name},</h3>
//       <p>Welcome! Please click the link below to set your password:</p>
//       <a href="${setPasswordLink}">Set Your Password</a>
//       <p>This link will expire in 1 hour.</p>
//     `;

//     await sendEmail(email, "Complete Your Registration", emailContent);

//     res.status(200).json({
//       success: true,
//       message: "Signup successful. Email sent with password setup link.",
//       user: {
//         id: user._id,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error"
//     });
//   }
// };

// module.exports = SignUserController;


const userService = require("../../services/userService");
// Import the specific function you created
const { sendPasswordEmail } = require("../../utils/sendEmail");

const SignUserController = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const { user, token } = await userService.createUser({
      first_name,
      last_name,
      email
    });

    
    await sendPasswordEmail(user.email, user.first_name, token);

    res.status(201).json({ 
      success: true,
      message: "Signup successful. Please check your email to set your password.",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

module.exports = SignUserController;