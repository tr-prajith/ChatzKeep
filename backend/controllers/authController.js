const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER (Step 1)
const register = async (req, res) => {
    try {
        const { email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            phone
        });

        res.status(201).json({
            success: true,
            message: "Registration Step 1 completed",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login Successful",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET CURRENT USER
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// COMPLETE PROFILE (STEP 2)
const completeProfile = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { address, city, state, pincode } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { address, city, state, pincode },
            { new: true }
        );

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    completeProfile
};