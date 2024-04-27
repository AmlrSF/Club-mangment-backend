const Club = require('../schema/clubs');
require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const Post = require('../schema/post');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
// Create a new club
const createClub = async (req, res) => {
    try {
        let profilePictureUrl = null;

        if (req.body.profilePicture) {
            const photoUrl = await cloudinary.uploader.upload(req.body.profilePicture);
            profilePictureUrl = photoUrl.url;
        }

        // Create the new club with the profile picture URL
        const newClub = await Club.create({
            ...req.body,
            profilePicture: profilePictureUrl
        });

        res.status(201).json({ success: true, club: newClub });
    } catch (error) {
        console.error('Error creating club:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};



// Get all clubs
const getAllClubs = async (req, res) => {
    try {
        const clubs = await Club.find().populate('ownerId');
        res.status(200).json({ success: true, clubs });
    } catch (error) {
        console.error('Error fetching clubs:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


const getAllClubsByownerID = async (req, res) => {
    const id = req.params.id;

    try {
        const clubs = await Club.find();
        console.log(clubs);
        let clubsbyId = clubs.filter(item=>item.ownerId == new ObjectId(id) );
        res.status(200).json({ success: true, clubsbyId });
    } catch (error) {
        console.error('Error fetching clubs:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


// Get a club by ID
const getClubById = async (req, res) => {
    const clubId = req.params.id;
    try {
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ success: false, error: 'Club not found' });
        }
        res.status(200).json({ success: true, club });
    } catch (error) {
        console.error('Error fetching club by ID:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Update a club by ID
const updateClub = async (req, res) => {
    const clubId = req.params.id;
    try {
        const updatedClub = await Club.findByIdAndUpdate(clubId, req.body, { new: true });
        if (!updatedClub) {
            return res.status(404).json({ success: false, error: 'Club not found' });
        }
        res.status(200).json({ success: true, club: updatedClub });
    } catch (error) {
        console.error('Error updating club:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const deleteClubById = async (req, res) => {
    const clubId = req.params.id;
    try {
        // Delete all posts related to the club
        await Post.deleteMany({ club: clubId });
        
        // Now delete the club
        const deletedClub = await Club.findByIdAndDelete(clubId);
        
        if (!deletedClub) {
            return res.status(404).json({ success: false, error: 'Club not found' });
        }
        
        res.status(200).json({ success: true, message: 'Club deleted successfully' });
    } catch (error) {
        console.error('Error deleting club:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


module.exports = {
    createClub,
    getAllClubs,
    getClubById,
    updateClub,
    deleteClubById,
    getAllClubsByownerID
};
