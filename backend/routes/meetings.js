const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createMeeting, getMeetings, updateMeetingStatus, getMeetingStats } = require('../controllers/meetingsController');

router.get('/stats', auth, getMeetingStats);

router.post('/', auth, createMeeting);
router.get('/', auth, getMeetings);
router.put('/:id/status', auth, updateMeetingStatus);

module.exports = router;