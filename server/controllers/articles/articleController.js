const {
  getAllPublished,
  getArticlesByAuthor,
  getArticleById,
  updateArticle,
  deleteArticle,
  createArticle,
  getDraftArticle,
  searchByAuthor,
  searchArticles,
  getArticles,
  searchByTerm,
} = require("../../services/articleService");

const {
  createArticleSchema,
  updateArticleSchema,
} = require("../../validation/articleValidations");

const getAllPublishedArticlesController = async (req, res) => {
  try {
    const articles = await getAllPublished();
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("GET ALL PUBLISHED ARTICLES FAILED:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles due to server error",
    });
  }
};

const getMyArticlesController = async (req, res) => {
  try {
    const articles = await getArticlesByAuthor(req.user.id);
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("GET MY ARTICLES FAILED:", error);

    if (error.message.includes("Invalid author ID")) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch your articles due to server error",
    });
  }
};


const createArticleController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: ["coverImage is required"],
      });
    }
    const { error, value } = createArticleSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.details.map((err) => err.message),
      });
    }
    
    
    console.log(value);

    const articleData = {
      ...value,
      author: req.user.id,
      coverImage: req.file.path,
    };

    const newArticle = await createArticle(articleData);

    res.status(201).json({
      success: true,
      message: "Article created successfully.",
      data: newArticle,
    });
  } catch (error) {
    console.error("CREATE ARTICLE FAILED:", error);

    if (error.message.includes("Validation error")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create article due to a server error.",
    });
  }
};

const getArticleByIdController = async (req, res) => {
  try {
    const article = await getArticleById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    if (article.status === "draft") {
      const isOwner = article.author._id.toString() === req.user?.id;

      if (!isOwner) {
        return res.status(404).json({
          success: false,
          message:
            "Article not found or you do not have permission to view it.",
        });
      }
    }
    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("GET ARTICLE BY ID FAILED:", error);

    if (error.message.includes("Invalid article ID")) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch article due to server error",
    });
  }
};

const searchByTitleController = async (req, res) => {
  try {
    const { q: title } = req.query;
    

    if (!title) {
      return res.status(400).json({ success: false, message: 'A search term (q) is required.' });
    }

    const { articles, pagination } = await searchArticles(title);

    res.status(200).json({
      success: true,
      count: articles.length,
      pagination,
      data: articles,
    });
  } catch (error) {
    console.error("SEARCH ARTICLES FAILED:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search articles due to a server error",
    });
  }
};

const searchByAuthorController = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ success: false, message: 'An author name is required.' });
    }

    const { articles, pagination } = await searchByAuthor(name);

    res.status(200).json({
      success: true,
      count: articles.length,
      pagination,
      data: articles,
    });
  } catch (error) {
    console.error("SEARCH BY AUTHOR FAILED:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search articles due to a server error",
    });
  }
};


const updateArticleController = async (req, res) => {
  try {
    const { error, value } = updateArticleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const updateData = { ...value };

    if (req.file) {
      // If a new file was uploaded than add its path to the data
      updateData.coverImage = req.file.path;
    }
    const updatedArticle = await updateArticle(
      req.params.id,
      req.user,
      updateData
    );
    res.status(200).json({
      success: true,
      message: "Article updated successfully.",
      data: updatedArticle,
    });
  } catch (error) {
    console.error("UPDATE ARTICLE FAILED:", error);

    if (error.message.includes("Invalid")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes("authorized")) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update article due to server error",
    });
  }
};

const deleteArticleController = async (req, res) => {
  try {
    const result = await deleteArticle(req.params.id, req.user);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete article failed:", error);

    if (error.message.includes("Invalid")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes("authorized")) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete article due to server error",
    });
  }
};
const getPublishedByAuthorController = async (req, res) => {
  try {
    const articles = await getArticlesByAuthor(req.params.authorId);

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error("GET PUBLISHED BY AUTHOR FAILED:", error);

    if (error.message.includes("Invalid author ID")) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch articles due to a server error",
    });
  }
};
const getDraftArticlesOfUserController = async(req,res) => {
  try{
    const articles = await getDraftArticle(req.user.id);

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    console.error('GET DRAFT ARTICLES FAILED:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your draft articles due to a server error'
    });

}
};
const getArticlesController = async (req, res) => {
  try {
    const result = await getArticles(req.user, req.query); 
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const searchByTermController = async (req, res) => {
  try {
    const { term } = req.params; // Get the search term from the URL path
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!term || term.trim() === "") {
      return res.status(400).json({ success: false, message: 'A search term is required.' });
    }

    const { articles, pagination } = await searchByTerm(term, page, limit);

    res.status(200).json({
      success: true,
      count: articles.length,
      pagination,
      data: articles,
    });
  } catch (error) {
    console.error("SEARCH BY TERM FAILED:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search for articles due to a server error",
    });
  }
};

module.exports = {
  getPublishedByAuthorController,
  getAllPublishedArticlesController,
  getMyArticlesController,
  createArticleController,
  getArticleByIdController,
  updateArticleController,
  deleteArticleController,
  getDraftArticlesOfUserController,
  searchByAuthorController,
  searchByTitleController,
  getArticlesController,
  searchByTermController
};
