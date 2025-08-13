
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");


const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

const getUserById = async (userId) => {
  return await findUserById(userId);
};


const getByRole = async (role) => {
  try {
    const users = await User.find({ 
      role: role,
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false }
      ]
    }).select('-password');
    
    console.log(` Searching for role: "${role}", Found: ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Error in getByRole service:', error);
    throw new Error(`Error fetching users by role: ${error.message}`);
  }
};

const createUser = async ({ first_name, last_name, email }) => {
  const user = await User.create({ first_name, last_name, email });

  const token = jwt.sign(
    { userId: user._id, purpose: "set-password" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { user, token };
};
const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

   
    const users = await User.find({ 
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false }
      ]
    })
      .select("-password ") 
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ 
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false }
      ]
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error getting all users: ${error.message}`);
  }
};

const getDeletedUsers = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const users = await User.find({ isDeleted: true })
      .select("-password +isDeleted +deletedAt")
      .skip(skip)
      .limit(limit)
      .sort({ deletedAt: -1 });

    const total = await User.countDocuments({ isDeleted: true });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error getting deleted users: ${error.message}`);
  }
};

const updateUserProfile = async (userId, updateData) => {
  try {
    // Prevent password update
    if ("password" in updateData ) {
      throw new Error("You cannot update password or email from this route");
    }
    if ("email" in updateData) {
      const existingUser = await findUserByEmail(updateData.email);
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        throw new Error("Email is already in use by another user");
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    throw new Error(`Error updating user profile: ${error.message}`);
  }
};

const updateMyProfilee = async (userId, updateData) => {
  const allowedUpdates = ['first_name', 'last_name', 'email'];
  const requestedUpdates = Object.keys(updateData);
  const isValidOperation = requestedUpdates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new Error('Invalid update! You can only update first_name, last_name, and email.');
  }


  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true 
  }).select('-password');

  if (!user) {
    throw new Error('User not found.');
  }

  return user; 
}

const setUserPassword = async (token, password) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }

  if (decoded.purpose !== "set-password") {
    throw new Error("Invalid token purpose");
  }

  const user = await User.findById(decoded.userId);
  if (!user) throw new Error("User not found");
  if (user.password) throw new Error("Password already set");

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  return user;
};

const verifyUserLogin = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password");

  if (!user.password) {
    throw new Error("Please complete your registration by setting a password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  return user;
};


const updateUserImage = async (userId, newImagePath) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      fs.unlinkSync(newImagePath);
      throw new Error('User not found.');
    }

    if (user.image) {
      const oldImagePath = path.join(__dirname, '..', 'public', user.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const relativeImagePath = path.join('uploads', 'profiles', path.basename(newImagePath)).replace(/\\/g, "/");
    user.image = relativeImagePath;
    await user.save();

    return user;
  } catch (error) {
    throw error;
  }
};



module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  setUserPassword,
  verifyUserLogin,
  getAllUsers,
  updateUserProfile,
  getDeletedUsers,
  getUserById,
  updateMyProfilee,
  getByRole,
  updateUserImage,
};
