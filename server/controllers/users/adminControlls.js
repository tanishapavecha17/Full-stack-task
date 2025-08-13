const User = require("../../models/userModel");
const { findUserById, updateUserProfile, getAllUsers, getByRole } = require("../../services/userService");

const getAllUsersControllers = async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    const result = await getAllUsers(Number(page), Number(limit));

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      ...result, 
    });
  } catch (err) {
    console.error("Error fetching all users:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching users controllers",
    });
  }
};

const getById = async (req, res) => {
  try {
    const userId = req.params.id; 

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
};

const getByRoleController = async (req, res) => {
  try {
    const { role } = req.params;
    const validRoles = ['Admin', 'User'];
    const roleMatch = validRoles.find(validRole => 
      validRole.toLowerCase() === role.toLowerCase()
    );
    
    if (!roleMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
        validRoles: validRoles,
        receivedRole: role
      });
    }  
    const users = await getByRole(roleMatch);
    console.log(`Found ${users.length} users with role "${roleMatch}"`);
    
    res.status(200).json({
      success: true,
      message: `Users with role '${role}' retrieved successfully`,
      count: users.length,
      data: users
    });
    
  } catch (err) {
    console.error("Error in getting users :", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const editUserByIdControllers = async (req, res) => {
  try {
    
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const updateData = req.body;
    
    
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Update data is required",
      });
    }

    const updatedUser = await updateUserProfile(userId, updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating user",
    });
  }
};


const deleteUserByIdController = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Soft delete by updating isDeleted and deletedAt
    const deleteData = {
      isDeleted: true,
      deletedAt: new Date()
    };
    
    const deletedUser = await updateUserProfile(userId, deleteData);
    
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting user",
    });
  }
};
module.exports = { getAllUsersControllers, getById, editUserByIdControllers, deleteUserByIdController, getByRoleController };