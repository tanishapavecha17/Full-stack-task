const express = require("express");
const router = express.Router();
const validateToken = require('../middlewares/validatetoken');
const { getAllPublishedArticlesController, getArticleByIdController, createArticleController, getMyArticlesController, updateArticleController, deleteArticleController, getPublishedByAuthorController, getDraftArticlesOfUserController } = require("../controllers/articles/articleController");
const validateAdmin = require("../middlewares/validatetokenadmin");
const upload = require("../middlewares/uploadArticleImage");



// GET  - Get all published articles
router.get('/all-articles', validateToken,getAllPublishedArticlesController);

// GET - Get a single article by its ID
router.get('/:id',validateToken,getArticleByIdController);

// Create a new article
router.post('/new-article', validateToken, upload.single('coverImage'),createArticleController);

// GET - Get all articles (drafts & published) 
router.get('/me/my-articles', validateToken, getMyArticlesController);

// PUT Update an article 
router.put('/edit-article/:id', validateToken, upload.single('coverImage'),updateArticleController);

// - Delete an article 
router.delete('/my-articles/delete/:id', validateToken, deleteArticleController);

// Get articles of a particulr user by id
router.get('/all-articles/:authorId', validateToken, getPublishedByAuthorController);

//get- draft articles of user
router.get('/me/my-drafts', validateToken, getDraftArticlesOfUserController);


module.exports = router;