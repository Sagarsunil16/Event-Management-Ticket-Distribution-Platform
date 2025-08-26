import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/authContext'

interface Event {
  _id: string;
  title: string;
  date: string;
  venue: string;
  category: string;
}

const OrganizerDashboard: React.FC = () => {
  const { token,role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
  if (!token || role !== 'organizer') {
    navigate('/login');
  }
}, [token, role, navigate]);

  useEffect(() => {
    api.get('/events/organizer/events')
      .then(res => setEvents(res.data))
      .catch(() => setError('Failed to load events'));
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(event => event._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div>
      <h1>Organizer Dashboard</h1>
      <button onClick={() => navigate('/organizer/events/create')}>Create New Event</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <strong>{event.title}</strong> - {new Date(event.date).toLocaleDateString()} - {event.venue} ({event.category})
            <button onClick={() => navigate(`/organizer/events/edit/${event._id}`)}>Edit</button>
            <button onClick={() => handleDelete(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrganizerDashboard;
