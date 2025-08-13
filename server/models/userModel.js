const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    image: { 
      type: String, 
      default: null 
    },
    isDeleted: { 
      type: Boolean, 
      default: false, 
      select: false 
    },
    deletedAt: { 
      type: Date,  
      select: false },
  },
  {
    timestamps: true,
    query: {
      byActive() {                                                   
        return this.where({ isDeleted: { $ne: true } });                             //to get only isdeleted = false records
      },
    },
  }
);
userSchema.index({ isDeleted: 1, deletedAt: 1 });

module.exports = mongoose.model("User", userSchema);
