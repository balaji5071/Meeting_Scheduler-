const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createMeeting, getMeetings, updateMeetingStatus } = require('../controllers/meetingsController');

router.post('/', auth, createMeeting);
router.get('/', auth, getMeetings);
router.put('/:id/status', auth, updateMeetingStatus);

module.exports = router;
