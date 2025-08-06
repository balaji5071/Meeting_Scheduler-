
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

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
    console.log('[SUCCESS] Meeting created successfully in database.');

    // Send an email invitation to EVERYONE.
    const organizer = await User.findById(req.user.id);
    console.log(`[INFO] Preparing to send ${emailsToInvite.length} email invitations...`);

    for (const email of emailsToInvite) {
      await sendEmail({
        to: email,
        subject: `Meeting Invitation: ${title}`,
        text: `You have been invited to a meeting titled "${title}" by ${organizer.name}.\n\nIt is scheduled from ${new Date(startTime).toLocaleString()} to ${new Date(endTime).toLocaleString()}.\n\nDetails: ${description || 'No details provided.'}`,
      });
    }

    console.log('[SUCCESS] Finished sending all email invitations.');
    res.status(201).json(newMeeting);

  } catch (err) {
    console.error('[ERROR] An error occurred during meeting creation:', err.message);
    res.status(500).send('Server Error');
  }
};

// --- Make sure your other functions are still here ---
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
