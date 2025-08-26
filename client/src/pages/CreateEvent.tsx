// src/pages/CreateEvent.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    category: '',
    totalTickets: 10,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/events', form);
      setSuccess(true);
      setTimeout(() => navigate('/organizer/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Create failed');
    }
  };

  if (success) return <p>Event created! Redirecting...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
      <input name="date" value={form.date} onChange={handleChange} placeholder="Date" type="datetime-local" required />
      <input name="venue" value={form.venue} onChange={handleChange} placeholder="Venue" required />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
      <input name="totalTickets" value={form.totalTickets} min={1} onChange={handleChange} type="number" required />
      <button type="submit">Create Event</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default CreateEvent;
