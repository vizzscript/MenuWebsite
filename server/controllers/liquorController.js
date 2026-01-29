const Liquor = require('../models/Liquor');

// @desc    Get all liquors with filters
// @route   GET /api/liquors
// @access  Public
const getLiquors = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;
        let query = { isAvailable: true };

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const liquors = await Liquor.find(query).sort({ createdAt: -1 });
        res.json(liquors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single liquor
// @route   GET /api/liquors/:id
// @access  Public
const getLiquorById = async (req, res) => {
    try {
        const liquor = await Liquor.findById(req.params.id);
        if (liquor) {
            res.json(liquor);
        } else {
            res.status(404).json({ message: 'Liquor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a liquor
// @route   POST /api/liquors
// @access  Developer
const createLiquor = async (req, res) => {
    try {
        const liquor = new Liquor(req.body);
        const createdLiquor = await liquor.save();
        res.status(201).json(createdLiquor);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

// @desc    Update a liquor
// @route   PUT /api/liquors/:id
// @access  Developer
const updateLiquor = async (req, res) => {
    try {
        const liquor = await Liquor.findById(req.params.id);

        if (liquor) {
            Object.assign(liquor, req.body);
            const updatedLiquor = await liquor.save();
            res.json(updatedLiquor);
        } else {
            res.status(404).json({ message: 'Liquor not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Liquor not found', error: error.message });
    }
};

// @desc    Delete a liquor
// @route   DELETE /api/liquors/:id
// @access  Developer
const deleteLiquor = async (req, res) => {
    try {
        const liquor = await Liquor.findById(req.params.id);

        if (liquor) {
            await liquor.deleteOne();
            res.json({ message: 'Liquor removed' });
        } else {
            res.status(404).json({ message: 'Liquor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getLiquors,
    getLiquorById,
    createLiquor,
    updateLiquor,
    deleteLiquor
};
