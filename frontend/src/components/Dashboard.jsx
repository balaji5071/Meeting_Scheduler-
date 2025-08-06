import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', startTime: '', endTime: '', participantEmails: '' });

  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMeetings();
    }
  }, [user]);

  const fetchMeetings = async () => {
    try {
      const res = await api.get('/meetings');
      setMeetings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMeeting = async e => {
    e.preventDefault();
    const emails = formData.participantEmails.split(',').map(email => email.trim());
    try {
      await api.post('/meetings', { ...formData, participantEmails: emails });
      setFormData({ title: '', description: '', startTime: '', endTime: '', participantEmails: '' });
      fetchMeetings();
    } catch (err) {
      alert('Error creating meeting');
    }
  };

  const handleStatusUpdate = async (meetingId, status) => {
    try {
        await api.put(`/meetings/${meetingId}/status`, { status });
        fetchMeetings();
    } catch (err) {
        alert('Error updating status');
    }
  };

  const handleLogout = () => {
      logout();
  }

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleLogout} style={{float: 'right'}}>Logout</button>
      <h2>Dashboard</h2>

      <h3>Create New Meeting</h3>
      <form onSubmit={handleCreateMeeting}>
        <input type="text" name="title" value={formData.title} onChange={onChange} placeholder="Title" required />
        <textarea name="description" value={formData.description} onChange={onChange} placeholder="Description"></textarea>
        <label>Start Time:</label>
        <input type="datetime-local" name="startTime" value={formData.startTime} onChange={onChange} required />
        <label>End Time:</label>
        <input type="datetime-local" name="endTime" value={formData.endTime} onChange={onChange} required />
        <textarea name="participantEmails" value={formData.participantEmails} onChange={onChange} placeholder="Participant emails (comma-separated)"></textarea>
        <button type="submit">Create Meeting</button>
      </form>

      <h3>Your Meetings</h3>
      {meetings.map(meeting => (
        <div key={meeting._id} className="meeting-card">
          <h4>{meeting.title}</h4>
          <p><strong>Description:</strong> {meeting.description || 'N/A'}</p>
          <p><strong>Organizer:</strong> {meeting.organizer.name}</p>
          <p><strong>Time:</strong> {new Date(meeting.startTime).toLocaleString()} to {new Date(meeting.endTime).toLocaleString()}</p>
          <p><strong>Participants:</strong></p>
          <ul>
            {meeting.participants.map((p, index) => (
              <li key={`${p.email}-${index}`}>
                {p.userId ? p.userId.name : p.email} ({p.status})
              </li>
            ))}
          </ul>
          {meeting.participants.some(p => p.userId && p.userId._id === user.id && p.status === 'pending') && (
              <div>
                  <button onClick={() => handleStatusUpdate(meeting._id, 'accepted')}>Accept</button>
                  <button onClick={() => handleStatusUpdate(meeting._id, 'declined')}>Decline</button>
              </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
