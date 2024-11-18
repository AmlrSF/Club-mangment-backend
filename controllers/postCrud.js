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
        let image = null;

        if (req.body.imageUrl) {
            const photoUrl = await cloudinary.uploader.upload(req.body.imageUrl);
            image = photoUrl.url;
        }


        console.log(req.body);

        // Create the new club with the profile picture URL
        const newPost = await Post.create({
            ...req.body,
            imageUrl: image
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
        const posts = await Post.find().populate('author').populate('club') .populate({
            path: 'comments.author',
        });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Get a post by ID
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        .populate('author').populate('club').populate({
            path: 'comments.author',
        }).populate({
            path: 'comments.replyTo',
        });
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
// Toggle upvote for a post
const toggleUpvote = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.body.id; // Assuming user ID is available in req.user

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const userIndexInUpvotes = post.upvotes.indexOf(userId);
        if (userIndexInUpvotes !== -1) {
            // If user has already upvoted, remove the upvote
            post.upvotes.splice(userIndexInUpvotes, 1);
        } else {
            // If user has not upvoted, add the upvote
            post.upvotes.push(userId);
            // If user has previously downvoted, remove the downvote
            const userIndexInDownvotes = post.downvotes.indexOf(userId);
            if (userIndexInDownvotes !== -1) {
                post.downvotes.splice(userIndexInDownvotes, 1);
            }
        }

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
        const postId = req.params.id;
        const userId = req.body.id; // Assuming user ID is available in req.user

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const userIndexInDownvotes = post.downvotes.indexOf(userId);
        if (userIndexInDownvotes !== -1) {
            // If user has already downvoted, remove the downvote
            post.downvotes.splice(userIndexInDownvotes, 1);
        } else {
            // If user has not downvoted, add the downvote
            post.downvotes.push(userId);
            // If user has previously upvoted, remove the upvote
            const userIndexInUpvotes = post.upvotes.indexOf(userId);
            if (userIndexInUpvotes !== -1) {
                post.upvotes.splice(userIndexInUpvotes, 1);
            }
        }

        await post.save();
        res.status(200).json({ success: true, message: 'Downvote toggled successfully', post });
    } catch (error) {
        console.error('Error toggling downvote for post:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const getPostByGroupeId = async(req,res)=>{
    try {
        try {
            const posts = await Post.find({club : req.params.id});
            res.status(200).json({ success: true, posts });
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } catch (error) {
        
    }
}


const addComment = async (req, res) => {
    const { id } = req.params; // Get post ID from params
    const { content, author, replyTo } = req.body; // Get comment data from body

    try {
        const post = await Post.findById(id);
        //console.log(post);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create new comment
        const newComment = {
            content,
            author,
            replyTo: replyTo || null, // If it's a reply, include the replyTo field
            commentDate: new Date()
        };

        console.log(newComment);
        

        // Add comment to the post's comments array
        post.comments.push(newComment);
        await post.save();

        res.status(201).json({ message: 'Comment added', post });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

const toggleLike = async (req, res) => {
    try {
        const postId = req.params.postId; // ID of the post containing the comment
        const commentId = req.params.commentId; // ID of the comment
        const userId = req.body.id; // Assuming user ID is available in req.body

        // Find the post by ID
        const post = await Post.findById(postId);
        console.log(post);

        console.log(postId, commentId, userId);
        
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        // Find the comment within the post's comments array by ID
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }

        // Check if the user has already liked the comment
        const userIndexInLikes = comment.likes.indexOf(userId);
        if (userIndexInLikes !== -1) {
            // If user has already liked, remove the like
            comment.likes.splice(userIndexInLikes, 1);
        } else {
            // If user has not liked, add the like
            comment.likes.push(userId);
        }

        // Save the updated post with modified comment likes
        await post.save();
        res.status(200).json({ success: true, message: 'Comment like toggled successfully', post });
    } catch (error) {
        console.error('Error toggling like for comment:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
    
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }

     
        // Remove the comment
        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).json({ success: true, message: 'Comment deleted successfully', post });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const editComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { content, authorId } = req.body; // Get new content and author ID from request body

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        const comment = post.comments.find(comment => comment._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }

     

        // Update the comment content
        comment.content = content;
        await post.save();

        res.status(200).json({ success: true, message: 'Comment edited successfully', post });
    } catch (error) {
        console.error('Error editing comment:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};



module.exports = {
    toggleLike,
    addComment,
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePostById,
    toggleUpvote,
    toggleDownvote,
    getPostByGroupeId,
    editComment,
    deleteComment
};
