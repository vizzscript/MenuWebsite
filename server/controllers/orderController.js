const Order = require('../models/Order');

// @desc    Create a new order (notification)
// @route   POST /api/orders
// @access  Public (User)
const createOrder = async (req, res) => {
    try {
        const { userId, liquorId } = req.body;

        if (!userId || !liquorId) {
            return res.status(400).json({ message: 'User ID and Liquor ID are required' });
        }

        const order = await Order.create({
            user: userId,
            liquor: liquorId
        });

        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'name mobileNumber')
            .populate('liquor', 'name brand price category');

        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all orders (notifications)
// @route   GET /api/orders
// @access  Public (Admin)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name mobileNumber')
            .populate('liquor', 'name brand price imageUrl category')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Public (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

module.exports = { createOrder, getOrders, updateOrderStatus };
