import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import EventList from "./components/EventList";
import Register from "./components/Auth/Register";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import CreateEvent from "./pages/organizer/CreateEvent";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import EditEvent from "./pages/organizer/EditEvent";
import Navbar from "./components/Navbar";
import MyTickets from "./pages/attendee/MyTickets";
import Profile from "./pages/Profile";
import EventDetails from "./pages/attendee/EventDetails";
import PaymentPage from "./pages/attendee/PaymentPage";

const App = () => (
  <Router>
    <Navbar />
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

      <Route
        path="/profile"
        element={
          <ProtectedRoute role="attendee">
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/my"
        element={
          <ProtectedRoute role="attendee">
            <MyTickets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events/:id"
        element={
          <ProtectedRoute role="attendee">
            <EventDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events/:id/payment"
        element={
          <ProtectedRoute role="attendee">
            <PaymentPage />
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
        path="/organizer/profile"
        element={
          <ProtectedRoute role="organizer">
            <Profile />
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

      <Route
        path="/organizer/events/edit/:id"
        element={
          <ProtectedRoute role="organizer">
            <EditEvent />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
