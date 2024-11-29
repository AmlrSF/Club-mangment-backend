const SavedPost = require('../schema/SavedPosts'); // Adjust path as needed

// Create a new saved post
const createSavedPost = async (req, res) => {
    try {
        const { author, post } = req.body;

        // Check if the post is already saved by the user
        const existingSavedPost = await SavedPost.findOne({ author, post });

        if (existingSavedPost) {
            // If it exists, remove it (unsave)
            await SavedPost.deleteOne({ _id: existingSavedPost._id });
            return res.status(200).json({
                success: false,
                message: 'Post unsaved successfully.'
            });
        }

        // If it doesn't exist, create a new saved post
        const savedPost = new SavedPost({ author, post });
        await savedPost.save();

        res.status(201).json({
            success: true,
            message: 'Post saved successfully.',
            data: savedPost
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all saved posts
const getAllSavedPosts = async (req, res) => {
    try {
        const savedPosts = await SavedPost.find()
            .populate('author') // Populate author name
            .populate('post'); // Populate post content
        res.status(200).json({ success: true, data: savedPosts });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get a saved post by ID
const getSavedPostById = async (req, res) => {
    try {
        const savedPost = await SavedPost.findById(req.params.id)
            .populate('author', 'name')
            .populate('post', 'content');

        if (!savedPost) {
            return res.status(404).json({ success: false, message: 'Saved post not found' });
        }

        res.status(200).json({ success: true, data: savedPost });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update a saved post by ID
const updateSavedPost = async (req, res) => {
    try {
        const updatedSavedPost = await SavedPost.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedSavedPost) {
            return res.status(404).json({ success: false, message: 'Saved post not found' });
        }

        res.status(200).json({ success: true, data: updatedSavedPost });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete a saved post by ID
const deleteSavedPostById = async (req, res) => {
    try {
        const deletedSavedPost = await SavedPost.findByIdAndDelete(req.params.id);

        if (!deletedSavedPost) {
            return res.status(404).json({ success: false, message: 'Saved post not found' });
        }

        res.status(200).json({ success: true, message: 'Saved post deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createSavedPost,
    getAllSavedPosts,
    getSavedPostById,
    updateSavedPost,
    deleteSavedPostById
};
