const express = require('express');
const router = express.Router();
const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePostById,
    toggleUpvote,
    toggleDownvote,
    getPostByGroupeId
} = require('../controllers/postCrud');

// Define routes for the base endpoint '/posts'
router.route('/')
    .post(createPost) // Create a new post
    .get(getAllPosts); // Get all posts

// Define routes for endpoints with post IDs
router.route('/:id')
    .get(getPostById) // Get a post by ID
    .put(updatePost) // Update a post by ID
    .delete(deletePostById); // Delete a post by ID

router.route('/club/:id')
    .get(getPostByGroupeId)
// Route to toggle upvote for a post
router.route('/:id/upvote')
    .patch(toggleUpvote);

// Route to toggle downvote for a post
router.route('/:id/downvote')
    .patch(toggleDownvote);

module.exports = router;
