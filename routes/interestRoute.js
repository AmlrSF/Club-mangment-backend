const express = require('express');
const router = express.Router();
const {
    createInterest,
    getAllInterests,
    getInterestById,
    updateInterest,
    deleteInterestById
} = require('../controllers/intersetCrud');

router.route('/')
    .post(createInterest)
    .get(getAllInterests);

router.route('/:id')
    .get(getInterestById)
    .put(updateInterest)
    .delete(deleteInterestById);

module.exports = router;
