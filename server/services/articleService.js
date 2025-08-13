const fs = require("fs");
const Article = require("../models/articleModel");
const { validateObjectId } = require("../validation/articleValidations");
const { log } = require("console");

const createArticle = async (articleData) => {
  try {
    const newArticle = await Article.create(articleData);
    return newArticle.populate("author", "first_name last_name image");
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw new Error("Failed to create article");
  }
};

const getAllPublished = async () => {
  try {
    return Article.find({ status: "published" })
      .byActive()
      .populate("author", "first_name last_name image")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Failed to fetch published articles");
  }
};

const getArticlesByAuthor = async (authorId) => {
  try {
    validateObjectId(authorId, "Invalid article ID format");
    console.log(Article.find({ author: authorId }).sort({ createdAt: -1 }));

    return Article.find({ author: authorId, status: "published" })
      .byActive()
      .sort({ createdAt: -1 });
  } catch (error) {
    if (error.message.includes("Invalid author ID")) {
      throw error;
    }
    throw new Error("Failed to fetch articles by author");
  }
};

const getDraftArticle = async (authorId) => {
  try {
    validateObjectId(authorId, "Invalid author ID format");
    return Article.find({ author: authorId, status: "draft" })
      .byActive()
      .sort({ createdAt: -1 });
  } catch (error) {
    if (error.message.includes("Invalid author ID")) {
      throw error;
    }
    throw new Error("Failed to fetch articles by author");
  }
};

const getArticleById = async (articleId) => {
  try {
    validateObjectId(articleId, "Invalid article ID format");

    return Article.findById(articleId)
      .byActive()
      .populate("author", "first_name last_name image");
  } catch (error) {
    if (error.message.includes("Invalid article ID")) {
      throw error;
    }
    throw new Error("Failed to fetch article");
  }
};

const updateArticle = async (articleId, user, updateData) => {
  try {
    validateObjectId(articleId, "Invalid article ID format");

    const article = await Article.findById(articleId).byActive();
    if (!article) {
      throw new Error("Article not found.");
    }
    console.log(article);
    console.log(user);
    console.log(user.id);

    const isOwner = article.author.toString() === user.id;
    const isAdmin = user.role?.toLowerCase() === "admin";

    if (isAdmin) {
      if (article.status !== "published") {
        throw new Error("Article not found or invalid article id");
      }
      if (updateData.status) {
        throw new Error("Admin not authorized to change article status.");
      }
    } else if (!isOwner) {
      throw new Error("User not authorized to update this article.");
    }

    if (updateData.coverImage && article.coverImage) {
      fs.unlink(article.coverImage, (err) => {
        if (err) console.error("Error deleting old image:", err);
      });
    }

    Object.assign(article, updateData);
    await article.save();

    return article.populate("author", "first_name last_name image");
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("not authorized") ||
      error.message.includes("Invalid")
    ) {
      throw error;
    }
    throw new Error("Failed to update article in service layer");
  }
};

const deleteArticle = async (articleId, user) => {
  console.log(user);
  const article = await Article.findOne({ _id: articleId }).byActive();
  console.log(article);

  if (!article) {
    throw new Error("Article not found.");
  }
  const isOwner = article.author.toString() === user.id;
  const isAdmin = user.role?.toLowerCase() === "admin";

  if (article.status === "draft") {
    if (!isOwner) {
      throw new Error("User not authorized to delete this article.");
    }
    if (article.coverImage) {
      fs.unlink(article.coverImage, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }
    await article.deleteOne();
    return { message: "Article permanently deleted successfully." };
  } else if (article.status === "published") {
    //author and Admin can softt delete a published article.
    if (!isOwner && !isAdmin) {
      throw new Error("User not authorized to delete this article.");
    }
    article.isDeleted = true;
    article.deletedAt = Date.now();
    await article.save();
    return { message: "Article moved to trash successfully." };
  }

  throw new Error("This article cannot be deleted.");
};

module.exports = {
  createArticle,
  getAllPublished,
  getArticlesByAuthor,
  getArticleById,
  updateArticle,
  deleteArticle,
  getDraftArticle,
};
