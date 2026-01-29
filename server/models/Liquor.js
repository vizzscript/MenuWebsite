const mongoose = require('mongoose');

const liquorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Whisky', 'Vodka', 'Rum', 'Beer', 'Wine', 'Gin', 'Tequila', 'Other']
    },
    alcoholPercentage: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Liquor', liquorSchema);
