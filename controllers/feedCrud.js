const Feed = require('../schema/feed');
const Interest = require('../schema/interest');

// Create a new Feed
const createFeed = async (req, res) => {
    try {
        const { name, interests,userId } = req.body;

        // Validate interests
        if (interests && interests.length > 0) {
            for (const interestId of interests) {
                const interestExists = await Interest.findById(interestId);
                if (!interestExists) {
                    return res.status(400).json({ message: `Interest ID ${interestId} does not exist.` });
                }
            }
        }

        const feed = await Feed.create({ name, interests, userId });
        res.status(201).json(feed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all Feeds
const getAllFeeds = async (req, res) => {
    try {
        const feeds = await Feed.find().populate('interests userId');
        res.status(200).json(feeds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Feed by ID
const getFeedById = async (req, res) => {
    try {
        const { id } = req.params;
        const feed = await Feed.findById(id).populate('interests userId');
        if (!feed) {
            return res.status(404).json({ message: 'Feed not found.' });
        }
        res.status(200).json(feed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Feed
const updateFeed = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, interests } = req.body;

        // Validate interests
        if (interests && interests.length > 0) {
            for (const interestId of interests) {
                const interestExists = await Interest.findById(interestId);
                if (!interestExists) {
                    return res.status(400).json({ message: `Interest ID ${interestId} does not exist.` });
                }
            }
        }

        const updatedFeed = await Feed.findByIdAndUpdate(
            id,
            { name, interests },
            { new: true, runValidators: true }
        ).populate('interests');

        if (!updatedFeed) {
            return res.status(404).json({ message: 'Feed not found.' });
        }

        res.status(200).json(updatedFeed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a Feed by ID
const deleteFeedById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFeed = await Feed.findByIdAndDelete(id);

        if (!deletedFeed) {
            return res.status(404).json({ message: 'Feed not found.' });
        }

        res.status(200).json({ message: 'Feed deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFeed,
    getAllFeeds,
    getFeedById,
    updateFeed,
    deleteFeedById
};
