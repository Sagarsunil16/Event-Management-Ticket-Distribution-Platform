import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import EventList from './components/EventList';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<EventList />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router>
);

export default App;
