
const Interest = require("../schema/interest");

// Create a new interest
const createInterest = async (req, res) => {
    try {
        const newInterest = await Interest.create(req.body);
        res.status(201).json(newInterest);
    } catch (error) {
        res.status(500).json({ error: 'Error creating interest' });
    }
};

// Get all interests
const getAllInterests = async (req, res) => {
    try {
        const interests = await Interest.find();
        res.status(200).json(interests);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving interests' });
    }
};

// Get interest by ID
const getInterestById = async (req, res) => {
    try {
        const interest = await Interest.findById(req.params.id);
        if (!interest) {
            return res.status(404).json({ error: 'Interest not found' });
        }
        res.status(200).json(interest);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving interest' });
    }
};

// Update interest by ID
const updateInterest = async (req, res) => {
    try {
        const updatedInterest = await Interest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInterest) {
            return res.status(404).json({ error: 'Interest not found' });
        }
        res.status(200).json(updatedInterest);
    } catch (error) {
        res.status(500).json({ error: 'Error updating interest' });
    }
};

// Delete interest by ID
const deleteInterestById = async (req, res) => {
    try {
        const deletedInterest = await Interest.findByIdAndDelete(req.params.id);
        if (!deletedInterest) {
            return res.status(404).json({ error: 'Interest not found' });
        }
        res.status(200).json({ message: 'Interest deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting interest' });
    }
};

module.exports = {
    createInterest,
    getAllInterests,
    getInterestById,
    updateInterest,
    deleteInterestById
};
