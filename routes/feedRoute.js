const express = require('express');
const router = express.Router();
const {
    createFeed,
    getAllFeeds,
    getFeedById,
    updateFeed,
    deleteFeedById
} = require('../controllers/feedCrud');

router.route('/')
    .post(createFeed)
    .get(getAllFeeds);

router.route('/:id')
    .get(getFeedById)
    .put(updateFeed)
    .delete(deleteFeedById);

module.exports = router;
