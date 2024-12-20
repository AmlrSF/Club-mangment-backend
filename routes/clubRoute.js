const express = require('express');
const router = express.Router();
const {
    createClub,
    getAllClubs,
    getClubById,
    updateClub,
    deleteClubById,
    getAllClubsByownerID,
    joinSquad,
    upgradeUserToModerator,
    downgradeUserToModerator,
    banUserFromSquad
} = require('../controllers/clubCrud');

// Define routes for the base endpoint '/clubs'
router.route('/')
    .post(createClub) // Create a new club
    .get(getAllClubs); // Get all clubs

// Define routes for endpoints with club IDs
router.route('/:id')
    .get(getClubById) // Get a club by ID
    .put(updateClub) // Update a club by ID
    .delete(deleteClubById) // Delete a club by ID

router.route('/upgrade/:id').put(upgradeUserToModerator);
router.route('/downgrade/:id').put(downgradeUserToModerator);
router.route('/banuser/:id').put(banUserFromSquad)

router.route("/joinclub/:id").post(joinSquad);
    
router.route('/ownerId/:id').get(getAllClubsByownerID)
module.exports = router;
