const User = require('../models/user.model');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        res.status(201).json({
            message: 'User registered successfully',
            token: user.generateToken()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            token: user.generateToken()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};