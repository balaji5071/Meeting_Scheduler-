const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    lowercase: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined'], 
    default: 'pending' 
  },
}, { _id: false });

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required:true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [participantSchema],

  remindersSent: { 
    type: [Number], 
    default: [] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
