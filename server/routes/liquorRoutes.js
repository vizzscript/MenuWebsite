const express = require('express');
const router = express.Router();
const {
    getLiquors,
    getLiquorById,
    createLiquor,
    updateLiquor,
    deleteLiquor
} = require('../controllers/liquorController');

router.route('/')
    .get(getLiquors)
    .post(createLiquor);

router.route('/:id')
    .get(getLiquorById)
    .put(updateLiquor)
    .delete(deleteLiquor);

module.exports = router;
