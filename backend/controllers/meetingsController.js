const Meeting = require('../models/Meeting');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

// Function to create a new meeting
exports.createMeeting = async (req, res) => {
  const { title, description, startTime, endTime, participantEmails } = req.body;
  const emailsToInvite = Array.isArray(participantEmails) ? participantEmails : [];
  try {
    const registeredUsers = await User.find({ email: { $in: emailsToInvite } });
    const participants = emailsToInvite.map(email => {
      const registeredUser = registeredUsers.find(u => u.email === email.toLowerCase());
      return {
        email: email.toLowerCase(),
        userId: registeredUser ? registeredUser._id : null,
        status: 'pending'
      };
    });
    const newMeeting = new Meeting({
      title,
      description,
      startTime,
      endTime,
      organizer: req.user.id,
      participants,
    });
    await newMeeting.save();
    const organizer = await User.findById(req.user.id);
    for (const email of emailsToInvite) {
      await sendEmail({
        to: email,
        subject: `Meeting Invitation: ${title}`,
        text: `You have been invited to a meeting titled "${title}" by ${organizer.name}.\n\nIt is scheduled from ${new Date(startTime).toLocaleString()} to ${new Date(endTime).toLocaleString()}.\n\nDetails: ${description || 'No details provided.'}`,
      });
    }
    res.status(201).json(newMeeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to get all meetings for the logged-in user
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ organizer: req.user.id }, { 'participants.userId': req.user.id }],
    })
    .populate('organizer', 'name email')
    .populate('participants.userId', 'name email');
    res.json(meetings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to update a user's status for a meeting
exports.updateMeetingStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const meeting = await Meeting.findOneAndUpdate(
      { "_id": req.params.id, "participants.userId": req.user.id },
      { "$set": { "participants.$.status": status } },
      { new: true }
    );
    if (!meeting) {
      return res.status(404).json({ msg: 'Meeting not found or you are not a participant' });
    }
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Function to get meeting statistics using aggregation
exports.getMeetingStats = async (req, res) => {
  try {
    const stats = await Meeting.aggregate([
      {
        $group: {
          _id: '$organizer',
          meetingCount: { $sum: 1 }
        }
      },
      {
        $sort: { meetingCount: -1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id', // Corrected this line
          as: 'organizerInfo'
        }
      },
      {
        $unwind: '$organizerInfo'
      },
      {
        $project: {
          _id: 0,
          organizerId: '$_id',
          organizerName: '$organizerInfo.name',
          meetingCount: '$meetingCount'
        }
      }
    ]);
    res.status(200).json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
