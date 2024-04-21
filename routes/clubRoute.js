const express = require('express');
const router = express.Router();
const {
    createClub,
    getAllClubs,
    getClubById,
    updateClub,
    deleteClubById
} = require('../controllers/clubCrud');

// Define routes for the base endpoint '/clubs'
router.route('/')
    .post(createClub) // Create a new club
    .get(getAllClubs); // Get all clubs

// Define routes for endpoints with club IDs
router.route('/:id')
    .get(getClubById) // Get a club by ID
    .put(updateClub) // Update a club by ID
    .delete(deleteClubById); // Delete a club by ID

module.exports = router;
