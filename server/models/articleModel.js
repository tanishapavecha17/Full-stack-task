const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // the connection to the User model
      required: true,
    },
    coverImage: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      select: false
    },
    deletedAt: { 
      type: Date, 
      select: false },
  },
  {
    timestamps: true,
    
  }
);

articleSchema.query.byActive = function() {
  return this.where({ isDeleted: { $ne: true } });
};

articleSchema.index({ isDeleted: 1, deletedAt: 1 });

module.exports = mongoose.model('Article', articleSchema);
