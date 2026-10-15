const express = require('express');
const router = express.Router();
const { getusers, user, postuser, loginuser,getus } = require('../contoller/logsign_control');
const upload=require('../config/uploads')

// Get all users
router.get("/all", getusers);

// Get single user by email
router.get("/user/:em", user);
router.get('/:email',getus);

// Register user
router.post("/register",upload.single('image'), postuser);

// Login user
router.post("/login", loginuser);

module.exports = router;
