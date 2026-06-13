const express = require('express')
const router = express.Router()

const { getAllUsers, updateProfile,  } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const { getCurrentUser, completeProfile } = require('../controllers/authController');




router.get("/all", protect ,getAllUsers);
router.get("/me", protect, getCurrentUser);
router.put('/details',completeProfile)
router.put("/profile", protect, updateProfile);


module.exports = router