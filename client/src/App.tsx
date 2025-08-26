import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import EventList from './components/EventList';
import Register from './components/Auth/Register';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<EventList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);

export default App;
