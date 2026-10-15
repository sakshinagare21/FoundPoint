const express = require('express');
const {
  submitClaim,
  getClaimsByItem,
  respondToClaim,
  getUserClaims
} = require('../contoller/claimcontroller');

const router = express.Router();

// POST: Submit a claim
router.post('/', submitClaim);

// GET: Get all claims for an item (for poster)
router.get('/item/:itemId', getClaimsByItem);

// PUT: Respond to a claim
router.put('/respond', respondToClaim);

// GET: Get all claims by a specific user (claimant)
router.get('/user/:email', getUserClaims);

module.exports = router;