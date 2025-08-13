const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const articleRoutes = require('./articleRoute');


router.use('/users', userRoutes);
router.use('/articles', articleRoutes);

module.exports = router;