const mongoose = require('mongoose')
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcryptUtils = require("../utils/bcryptUtils");
const jwtUtils = require("../utils/jwtUtils");


const registerUser = async (req, res) => {
  const { username, fullName, email, password, phone, dob, role } = req.body;
  const profilePicture = req.file ?`/uploads/${req.file.filename}`:null;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({
      username,
      fullName,
      email,
      password,
      phone,
      dob,
      profilePicture,
      role,
    });

    await user.save();

    const token = jwtUtils.generateToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      token,
      profilePicture:user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwtUtils.generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

const getUser = async(req,res)=>{
  const { username } = req.params;
  try{
    const user = await User.findOne({username});

    if(!user){
       res.status(404).json({message:"User not found"});
    }
    res.status(200).json({
      id:user._id,
      username:user.username,
      fullName:user.fullName,
      email:user.email,
      phone:user.phone,
      dob:user.dob,
      profilePicture:user.profilePicture,
      isClient:user.isClient,
    });
  }catch(error){
    res.status(500).json({message:"error fetching user", error})
  }
};


const updateUser = async (req, res) => {
  const {username, fullName,email,password, phone, dob, profilePicture } = req.body;
   
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = username || user.username;
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.password = password || user.password;
    user.phone = phone || user.phone;
    user.dob = dob || user.dob;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email:user.email,
        password:user.password,
        phone: user.phone,
        dob: user.dob,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const deleteUser = async (req, res) => {
  const {id} = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};


module.exports = { registerUser, loginUser, getUser, updateUser, deleteUser};