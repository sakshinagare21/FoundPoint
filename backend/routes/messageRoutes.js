const express = require('express');
const router = express.Router();
const { submitMessage, getAllMessages } = require('../contoller/messageController');
// const { validateMessageInput } = require('../validators/messageValidator');
// const { authenticateToken, isAdmin } = require('../middleware/auth'); // If you implement auth

// @route   POST api/messages
router.post('/', submitMessage);

// @route   GET api/messages (Admin only)
// router.get('/', authenticateToken, isAdmin, getAllMessages); // Uncomment when auth is ready
router.get('/', getAllMessages); // Open for now

module.exports = router;
