const userService = require("../../services/userService");
const { updateProfileSchema } = require("../../validation/validations");

const getMyProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    console.log("req.user.id:", req.user.id);

    const user = await userService.findUserByEmail(req.user.email);
    console.log("Retrieved user from DB:", user);

    const userProfile = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      profileImage: user.profileImage || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    console.log("Final userProfile:", userProfile);

    res.status(200).json({
      success: true,
      data: userProfile,
      message: "Profile retrieved successfully",
    });
  } catch (err) {
    console.log("Error in getMyProfile:", err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};



const updateMyProfile = async (req, res) => {
  try {
    
    const updateData = req.body;
    const imageFile = req.file;

    const updatedUser = await userService.updateMyProfilee(
      req.user.id,
      updateData,
      imageFile
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile failed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile due to a server error.",
    });
  }
};

const updateProfileImageController = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserImage(
      req.user.id,
      req.file.path
    );
    res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      data: { imagePath: updatedUser.image },
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const deleteProfileImage = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (!user.image) {
      return res
        .status(400)
        .json({ success: false, message: "No profile image to delete." });
    }

    const imagePath = path.join(__dirname, "..", "public", user.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    user.image = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  updateProfileImageController,
  deleteProfileImage,
};
