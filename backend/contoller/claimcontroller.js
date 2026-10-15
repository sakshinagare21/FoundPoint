const Claim = require('../model/claim');
const LostAndFoundItem = require('../model/lostandfounditem'); // Assuming this is your item model

// Submit a claim
const submitClaim = async (req, res) => {
  const { itemId, claimantEmail, answer } = req.body;

  // Validate request
  if (!itemId || !claimantEmail || !answer) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if item exists
    const item = await LostAndFoundItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is trying to claim their own item
    if (item.userEmail === claimantEmail) {
      return res.status(400).json({ message: 'You cannot claim your own item' });
    }

    // Check if user has already submitted a claim for this item
    const existingClaim = await Claim.findOne({ itemId, claimantEmail });
    if (existingClaim) {
      return res.status(400).json({ message: 'You have already submitted a claim for this item' });
    }

    const newClaim = new Claim({ 
      itemId, 
      claimantEmail, 
      answer,
      status: 'pending' // Ensure new claims always start as pending
    });

    await newClaim.save();

    // // Create notification for the item owner
    // const newNotification = new Notification({
    //   userEmail: item.userEmail,
    //   type: 'new_claim',
    //   message: `New claim received for your ${item.Name}`,
    //   itemId: item._id,
    //   relatedId: newClaim._id,
    //   read: false
    // });
    
    // await newNotification.save();

    res.status(201).json({ 
      message: 'Claim submitted successfully', 
      claim: newClaim 
    });

  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({ message: 'Error submitting claim', error: error.message });
  }
};

// Get all claims for a specific item (poster view)
const getClaimsByItem = async (req, res) => {
  const { itemId } = req.params;
  const { userEmail } = req.query; // Get the requesting user's email for verification

  if (!itemId) {
    return res.status(400).json({ message: 'Item ID is required' });
  }

  try {
    // Find the item first to verify it exists
    const item = await LostAndFoundItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Verify that the requesting user is the owner of the item
    if (userEmail && item.userEmail !== userEmail) {
      return res.status(403).json({ message: 'You can only view claims for your own items' });
    }

    // Get all claims for this item
    const claims = await Claim.find({ itemId }).sort({ createdAt: -1 });

    res.status(200).json(claims);

  } catch (error) {
    console.error('Error retrieving claims:', error);
    res.status(500).json({ message: 'Error retrieving claims', error: error.message });
  }
};

// Respond to a claim (accept or reject)
const respondToClaim = async (req, res) => {
  const { claimId, status, message } = req.body;
  const { userEmail } = req.query; // Get the requesting user's email for verification

  // Validate request
  if (!claimId || !status) {
    return res.status(400).json({ message: 'Claim ID and status are required' });
  }

  if (status !== 'accepted' && status !== 'rejected') {
    return res.status(400).json({ message: 'Status must be either "accepted" or "rejected"' });
  }

  try {
    // Find the claim
    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Find the item to verify ownership
    const item = await LostAndFoundItem.findById(claim.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Associated item not found' });
    }

    // Verify that the requesting user is the owner of the item
    if (userEmail && item.userEmail !== userEmail) {
      return res.status(403).json({ message: 'You can only respond to claims for your own items' });
    }

    // Update the claim status
    claim.status = status;
    if (message) {
      claim.responseMessage = message;
    }

    await claim.save();

    // Create notification for the claimant
    const statusMessage = status === 'accepted' 
      ? `Your claim for "${item.Name}" has been accepted!` 
      : `Your claim for "${item.Name}" has been rejected.`;
    
    // const newNotification = new Notification({
    //   userEmail: claim.claimantEmail,
    //   type: status === 'accepted' ? 'claim_accepted' : 'claim_rejected',
    //   message: statusMessage,
    //   itemId: item._id,
    //   relatedId: claim._id,
    //   read: false
    // });
    
    // await newNotification.save();

    // If claim is accepted, update item status to "Claimed"
    if (status === 'accepted') {
      item.status = 'Claimed';
      await item.save();
      
      // Reject all other claims for this item
      await Claim.updateMany(
        { 
          itemId: item._id, 
          _id: { $ne: claimId },
          status: 'pending'
        },
        { 
          status: 'rejected',
          responseMessage: 'This item has been claimed by another user.'
        }
      );
      
      // Create notifications for rejected claims
      const otherClaims = await Claim.find({ 
        itemId: item._id, 
        _id: { $ne: claimId },
        status: 'rejected'
      });
      
      // Create notifications for other claimants
      // for (const otherClaim of otherClaims) {
      //   const rejectNotification = new Notification({
      //     userEmail: otherClaim.claimantEmail,
      //     type: 'claim_rejected',
      //     message: `Your claim for "${item.Name}" has been rejected because the item was claimed by another user.`,
      //     itemId: item._id,
      //     relatedId: otherClaim._id,
      //     read: false
      //   });
        
      //   await rejectNotification.save();
      // }
    }

    res.status(200).json({ 
      message: `Claim ${status} successfully`, 
      claim 
    });

  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).json({ message: 'Error updating claim', error: error.message });
  }
};

// Get all claims by a specific user (claimant view)
const getUserClaims = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const claims = await Claim.find({ claimantEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(claims);
  } catch (error) {
    console.error('Error fetching user claims:', error);
    res.status(500).json({ message: 'Error fetching user claims', error: error.message });
  }
};

module.exports = {
  submitClaim,
  getClaimsByItem,
  respondToClaim,
  getUserClaims
};