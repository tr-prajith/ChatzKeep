const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id firstName lastName email phone");

    res.json(users);
  } catch (err) {
    res.status(500).json({message: err.message,});
  }
};

// settingd
const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      bio,
      phone,
      address,
      city,
      state,
      pincode,
      profileImage,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        bio,
        phone,
        address,
        city,
        state,
        pincode,
        profileImage,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = { getAllUsers, updateProfile };