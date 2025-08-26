import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import EventList from "./components/EventList";
import Register from "./components/Auth/Register";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => (
  <Router>
    <Routes>

      {/* Public only routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Attendee protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute role="attendee">
            <EventList />
          </ProtectedRoute>
        }
      />

      {/* Organizer protected routes */}
      <Route
        path="/organizer/dashboard"
        element={
          <ProtectedRoute role="organizer">
            <OrganizerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer/events/create"
        element={
          <ProtectedRoute role="organizer">
            <CreateEvent />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
