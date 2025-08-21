const mongoose = require("mongoose");
const Article = require("../models/articleModel");
const { validateObjectId } = require("../validation/articleValidations");
const fs = require("fs");

const getArticles = async (user, options = {}) => {
  const { page = 1, limit = 9 } = options;
  const skip = (page - 1) * limit;
  const byActive = { isDeleted: { $ne: true } };
  const matchStage = byActive;

  
  if (user.role === "admin") {
    if (options.status) {
      if (options.status === "draft") {
        if (options.articleId) {
          matchStage.status = "draft";
        } else {
          
          matchStage.status = "draft";
          matchStage.author = new mongoose.Types.ObjectId(user.id);
        }
      } else {
        matchStage.status = "published";
      }
    }
  } else {
    
    if (options.status === "draft") {
      matchStage.status = "draft";
      matchStage.author = new mongoose.Types.ObjectId(user.id);
    } else {
      matchStage.status = "published";
    }
  }

  
  if (options.title) {
    matchStage.title = { $regex: options.title, $options: "i" };
  }

  if (options.authorId && String(options.authorId).trim() !== "") {
    validateObjectId(options.authorId, "Invalid author ID format");
    matchStage.author = new mongoose.Types.ObjectId(options.authorId);
  }

  if (options.articleId) {
    validateObjectId(options.articleId, "Invalid article ID format");
    matchStage._id = new mongoose.Types.ObjectId(options.articleId);
  }

  const pipeline = [
    { $match: matchStage },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $unwind: {
        path: "$authorDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (options.authorName) {
    pipeline.push({
      $match: {
        $or: [
          {
            "authorDetails.first_name": {
              $regex: options.authorName,
              $options: "i",
            },
          },
          {
            "authorDetails.last_name": {
              $regex: options.authorName,
              $options: "i",
            },
          },
        ],
      },
    });
  }

  pipeline.push({
    $project: {
      title: 1,
      content: 1,
      status: 1,
      coverImage: 1,
      createdAt: 1,
      author: {
        _id: "$authorDetails._id",
        first_name: "$authorDetails.first_name",
        last_name: "$authorDetails.last_name",
        image: "$authorDetails.image",
      },
    },
  });

  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: skip }, { $limit: limit }],
    },
  });

  const result = await Article.aggregate(pipeline);
  const articles = result[0]?.data || [];
  const total = result[0]?.metadata?.[0]?.total || 0;
  const pages = Math.ceil(total / limit);

  return {
    articles,
    pagination: { page, limit, total, pages },
  };
};

const getAllPublished = async () => {
  return getArticles({ status: "published" });
};

const getArticlesByAuthor = async (authorId) => {
  return getArticles({ authorId, status: "published" });
};

const getDraftArticle = async (authorId) => {
  return getArticles({ authorId, status: "draft" });
};

const getArticleById = async (articleId) => {
  validateObjectId(articleId, "Invalid article ID format");
  return Article.findOne({ _id: articleId }).byActive();
};

const createArticle = async (articleData) => {
  try {
    console.log("trying to create an article");
    
    const newArticle = await Article.create(articleData);
    return newArticle;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw new Error("Failed to create article");
  }
};
const searchByTerm = async (searchTerm, page = 1, limit = 9) => {
  const skip = (page - 1) * limit;

  const searchRegex = { $regex: searchTerm, $options: 'i' };

  const pipeline = [
  
    {
      $match: {
        status: 'published',
        isDeleted: { $ne: true }
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails"
      }
    },
    { $unwind: "$authorDetails" },
   
    {
      $match: {
        $or: [
          { title: searchRegex },
          { "authorDetails.first_name": searchRegex },
          { "authorDetails.last_name": searchRegex }
        ]
      }
    },
    
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              title: 1,
              content: 1,
              status: 1,
              coverImage: 1,
              createdAt: 1,
              author: {
                _id: "$authorDetails._id",
                first_name: "$authorDetails.first_name",
                last_name: "$authorDetails.last_name",
                image: "$authorDetails.image",
              },
            },
          },
        ],
      },
    },
  ];

  const result = await Article.aggregate(pipeline);
  const articles = result[0]?.data || [];
  const total = result[0]?.metadata?.[0]?.total || 0;
  const pages = Math.ceil(total / limit);

  return {
    articles,
    pagination: { page, limit, total, pages },
  };
};

// const getAllPublished = async () => {
//   try {
//     return Article.find({ status: "published" })
//       .byActive()
//       .populate("author", "first_name last_name image")
//       .sort({ createdAt: -1 });
//   } catch (error) {
//     throw new Error("Failed to fetch published articles");
//   }
// };

// const getArticlesByAuthor = async (authorId) => {
//   try {
//     validateObjectId(authorId, "Invalid author ID format");
//     console.log(Article.find({ author: authorId }).sort({ createdAt: -1 }));

//     return Article.find({ author: authorId, status: "published" })
//       .byActive()
//       .sort({ createdAt: -1 });
//   } catch (error) {
//     if (error.message.includes("Invalid author ID") || error.message.includes("Invalid ObjectId")) {
//       throw error;
//     }
//     throw new Error("Failed to fetch articles by author");
//   }
// };

// const getDraftArticle = async (authorId) => {
//   try {
//     validateObjectId(authorId, "Invalid author ID format");
//     return Article.find({ author: authorId, status: "draft" })
//       .byActive()
//       .sort({ createdAt: -1 });
//   } catch (error) {
//     if (error.message.includes("Invalid author ID") || error.message.includes("Invalid ObjectId")) {
//       throw error;
//     }
//     throw new Error("Failed to fetch articles by author");
//   }
// };

// const getArticleById = async (articleId) => {
//   try {
//     validateObjectId(articleId, "Invalid article ID format");

//     return Article.findById(articleId)
//       .byActive()
//       .populate("author", "first_name last_name image");
//   } catch (error) {
//     if (error.message.includes("Invalid article ID") || error.message.includes("Invalid ObjectId")) {
//       throw error;
//     }
//     throw new Error("Failed to fetch article");
//   }
// };

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

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedArticle;
  } catch (error) {
    console.error("DETAILED UPDATE ERROR:", error); 
  
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
  try {
    validateObjectId(articleId, "Invalid article ID format");

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

      const deletedArticle = await Article.findByIdAndDelete(articleId, {
        new: true,
      });

      if (deletedArticle && deletedArticle.coverImage) {
        fs.unlink(deletedArticle.coverImage, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      }

      return { message: "Article permanently deleted successfully." };
    } else if (article.status === "published") {
      if (!isOwner && !isAdmin) {
        throw new Error("User not authorized to delete this article.");
      }

      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        {
          isDeleted: true,
          deletedAt: Date.now(),
        },
        { new: true }
      );

      return { message: "Article moved to trash successfully." };
    }

    throw new Error("This article cannot be deleted.");
  } catch (error) {
    if (
      error.message.includes("not found") ||
      error.message.includes("not authorized") ||
      error.message.includes("Invalid")
    ) {
      throw error;
    }
    throw new Error("Failed to delete article");
  }
};

module.exports = {
  createArticle,
  getAllPublished,
  getArticlesByAuthor,
  getArticleById,
  updateArticle,
  deleteArticle,
  getDraftArticle,
  getArticles,
  searchByTerm
};
