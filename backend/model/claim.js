const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lostandfounditem',
    required: true,
  },
  claimantEmail: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  responseMessage: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('claim', claimSchema);