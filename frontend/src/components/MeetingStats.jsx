import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MeetingStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/meetings/stats');
        setStats(res.data);
      } catch (err) {
        setError('Could not load statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading stats...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="meeting-stats">
      <h3>Meeting Organizer Leaderboard</h3>
      {stats.length > 0 ? (
        <ol>
          {stats.map((stat, index) => (
            <li key={stat.organizerId}>
              <strong>{stat.organizerName}</strong>: {stat.meetingCount} meeting(s) organized
            </li>
          ))}
        </ol>
      ) : (
        <p>No meetings have been organized yet.</p>
      )}
    </div>
  );
};

export default MeetingStats;
