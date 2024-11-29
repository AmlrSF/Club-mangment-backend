const express = require('express');
const router = express.Router();
const {
    createSavedPost,
    getAllSavedPosts,
    getSavedPostById,
    updateSavedPost,
    deleteSavedPostById
} = require('../controllers/savedPostCrud'); 

router.route('/')
    .post(createSavedPost)
    .get(getAllSavedPosts);

router.route('/:id')
    .get(getSavedPostById)
    .put(updateSavedPost)
    .delete(deleteSavedPostById);

module.exports = router;
