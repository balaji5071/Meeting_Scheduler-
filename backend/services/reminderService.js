const cron = require('node-cron');
const Meeting = require('../models/Meeting');
const { sendEmail } = require('./emailService');

const REMINDER_INTERVALS = [30, 15, 5, 1];

const sendReminderForInterval = async (meeting, interval) => {
  const reminderSubject = `Reminder: Meeting "${meeting.title}" in ${interval} minute(s)`;
  const reminderText = (name, role) => 
    `Hi ${name},\n\nThis is a reminder that your meeting "${meeting.title}" which you ${role}, is scheduled to start in ${interval} minute(s) at ${new Date(meeting.startTime).toLocaleTimeString()}.\n\nBest,\nThe Meeting Scheduler`;

  const acceptedParticipants = meeting.participants.filter(p => p.status === 'accepted');
  for (const participant of acceptedParticipants) {
    const user = participant.userId ? await User.findById(participant.userId) : null;
    const name = user ? user.name : participant.email;
    await sendEmail({
      to: participant.email,
      subject: reminderSubject,
      text: reminderText(name, 'accepted'),
    });
  }

  if (meeting.organizer) {
    await sendEmail({
      to: meeting.organizer.email,
      subject: reminderSubject,
      text: reminderText(meeting.organizer.name, 'organized'),
    });
  }
};


const startReminderService = () => {
  cron.schedule('*/1 * * * *', async () => {
    const now = new Date();
    console.log(`\n[MULTI-REMINDER SERVICE at ${now.toLocaleTimeString()}]`);

    try {
      const meetings = await Meeting.find({
        startTime: { $gt: now },
        remindersSent: { $ne: REMINDER_INTERVALS } 
      }).populate('organizer', 'name email');

      if (meetings.length === 0) {
        console.log(' -> No upcoming meetings need reminders right now.');
        return;
      }

      console.log(` -> Found ${meetings.length} upcoming meeting(s) to check.`);

      for (const meeting of meetings) {
        for (const interval of REMINDER_INTERVALS) {
          if (!meeting.remindersSent.includes(interval)) {
            const reminderTime = new Date(meeting.startTime.getTime() - interval * 60 * 1000);

            if (now >= reminderTime) {
              console.log(`   -> TRIGGER! Sending ${interval}-minute reminder for meeting: "${meeting.title}"`);
              
              await sendReminderForInterval(meeting, interval);

              meeting.remindersSent.push(interval);
              await meeting.save();
              console.log(`   -> SUCCESS! Marked ${interval}-minute reminder as sent.`);
            }
          }
        }
      }
    } catch (error) {
      console.error('[REMINDER SERVICE ERROR]', error);
    }
  });
};

module.exports = startReminderService;