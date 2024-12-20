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
    getPostByGroupeId,
    addComment,
    toggleLike,
    deleteComment,
    editComment
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

router.route('/:id/comment')
    .post(addComment); // Add a comment to a post

router.route('/:postId/comments/:commentId/like')
    .post(toggleLike); // Add a comment to a post

// Route to edit a comment
router.route('/:postId/comments/:commentId/edit')
    .post(editComment); 
// Route to delete a comment
router.route('/:postId/comments/:commentId')
    .delete(deleteComment); 

module.exports = router;
