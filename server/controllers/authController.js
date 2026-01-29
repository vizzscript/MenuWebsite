const User = require('../models/User');

// @desc    Auth user & get token (No token, just tracking)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { mobileNumber, name } = req.body;

        if (!mobileNumber || !name) {
            return res.status(400).json({ message: 'Mobile number and Name are required' });
        }

        // Find user and update name if changed, or create new
        let user = await User.findOneAndUpdate(
            { mobileNumber },
            { mobileNumber, name },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            _id: user._id,
            name: user.name,
            mobileNumber: user.mobileNumber,
            isAdmin: user.isAdmin || false, // Future proofing
            message: 'Welcome! You are logged in successful'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Admin Login
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res) => {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
        try {
            // Find or create the Admin user in the database to ensure they have a valid ObjectId
            // and can be referenced in Orders.
            // Find or create the Admin user in the database to ensure they have a valid ObjectId
            // and can be referenced in Orders.
            let adminUser = await User.findOneAndUpdate(
                { mobileNumber: 'admin' },
                {
                    name: 'Admin',
                    mobileNumber: 'admin',
                    isAdmin: true
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            res.status(200).json({
                _id: adminUser._id,
                name: adminUser.name,
                isAdmin: true,
                mobileNumber: adminUser.mobileNumber,
                message: 'Admin access granted'
            });
        } catch (error) {
            res.status(500).json({ message: 'Error creating admin user profile', error: error.message });
        }
    } else {
        res.status(401).json({ message: 'Invalid Admin Password' });
    }
};

module.exports = { loginUser, adminLogin };
