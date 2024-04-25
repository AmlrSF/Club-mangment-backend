const Post = require('../schema/post');
require('dotenv').config()
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
// Create a new post
const createPost = async (req, res) => {
    try {
        let profilePictureUrl = null;

        if (req.body.profilePicture) {
            const photoUrl = await cloudinary.uploader.upload(req.body.profilePicture);
            profilePictureUrl = photoUrl.url;
        }

        // Create the new club with the profile picture URL
        const newPost = await Post.create({
            ...req.body,
            imageUrl: profilePictureUrl
        });

        res.status(201).json({ success: true, posts: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author').populate('club');
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Get a post by ID
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Update a post by ID
const updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Delete a post by ID
const deletePostById = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Toggle upvote for a post
const toggleUpvote = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        post.upvotes += 1;
        await post.save();
        res.status(200).json({ success: true, message: 'Upvote toggled successfully', post });
    } catch (error) {
        console.error('Error toggling upvote for post:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Toggle downvote for a post
const toggleDownvote = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        post.downvotes += 1;
        await post.save();
        res.status(200).json({ success: true, message: 'Downvote toggled successfully', post });
    } catch (error) {
        console.error('Error toggling downvote for post:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const getPostByGroupeId = async()=>{
    try {
        try {
            const posts = await Post.find({author : req.params.id});
            res.status(200).json({ success: true, posts });
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } catch (error) {
        
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePostById,
    toggleUpvote,
    toggleDownvote,
    getPostByGroupeId
};
