const mongoose = require('mongoose');

const lostAndFoundSchema = mongoose.Schema({
    Name: { type: String, required: true },
    description: { type: String, required: true },
     status: { type: String, enum: ['Lost', 'Found', 'Claimed'], required: true },
    question: { type: String, required: true },
    images:{
        type:String,
        require:false
    },
    location: { type: String, required: true },
    userEmail: { type: String, required: true, ref: 'user_regs' }, // Referencing by email
}, { timestamps: true });

module.exports = mongoose.model('lostandfounditem', lostAndFoundSchema);
