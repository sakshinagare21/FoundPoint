const Message = require('../model/message');
// const { validationResult } = require('express-validator');

exports.submitMessage = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ 
  //     success: false, 
  //     message: 'Validation error', 
  //     errors: errors.array() 
  //   });
  // }

  try {
    const { name, email, message } = req.body;

    const newMessage = new Message({ name, email, message });
    const savedMessage = await newMessage.save();

    // Optional: Notify admin via email

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: savedMessage._id,
        createdAt: savedMessage.createdAt
      }
    });
  } catch (err) {
    console.error('Submit message error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'production' ? {} : err 
    });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      count: messages.length, 
      data: messages 
    });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'production' ? {} : err 
    });
  }
};
