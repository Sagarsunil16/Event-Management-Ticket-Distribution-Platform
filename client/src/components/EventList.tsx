import { useEffect, useState } from 'react';
import api from '../services/api';

interface Event {
  _id: string;
  title: string;
  date: string;
  venue: string;
  category: string;
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.get('/events/')
      .then(res => setEvents(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <strong>{event.title}</strong> - {new Date(event.date).toLocaleDateString()} - <em>{event.venue}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
