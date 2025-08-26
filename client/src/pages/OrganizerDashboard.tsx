import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { AuthContext } from "../context/authContext"
import { Calendar, MapPin, Users, Plus, Edit, Trash2, BarChart3, TrendingUp } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"

interface Event {
  _id: string
  title: string
  date: string
  venue: string
  category: string
  ticketsSold?: number
  totalTickets?: number
}

const OrganizerDashboard: React.FC = () => {
  const { token, role } = useContext(AuthContext)
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!token || role !== "organizer") {
      navigate("/login")
    }
  }, [token, role, navigate])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const res = await api.get("/events/organizer/events")
        setEvents(res.data)
      } catch {
        setError("Failed to load events")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchEvents()
    }
  }, [token])

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return

    try {
      setDeleteLoading(id)
      await api.delete(`/events/${id}`)
      setEvents((prev) => prev.filter((event) => event._id !== id))
    } catch {
      setError("Failed to delete event. Please try again.")
    } finally {
      setDeleteLoading(null)
    }
  }

  const totalEvents = events.length
  const upcomingEvents = events.filter((event) => new Date(event.date) > new Date()).length
  const totalTicketsSold = events.reduce((sum, event) => sum + (event.ticketsSold || 0), 0)
  const totalRevenue = totalTicketsSold * 25 // Assuming average ticket price

  const getCategoryColor = (category: string) => {
    const colors = {
      Music: "bg-purple-100 text-purple-800 border-purple-200",
      Sports: "bg-blue-100 text-blue-800 border-blue-200",
      Technology: "bg-green-100 text-green-800 border-green-200",
      Business: "bg-orange-100 text-orange-800 border-orange-200",
      Arts: "bg-pink-100 text-pink-800 border-pink-200",
      Food: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600">Manage your events and track performance</p>
            </div>
            <Button
              onClick={() => navigate("/organizer/events/create")}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200 h-10 sm:h-11 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Event
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{upcomingEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Tickets Sold</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalTicketsSold}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="text-red-800 text-sm sm:text-base">{error}</AlertDescription>
          </Alert>
        )}

        {/* Events Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="px-4 sm:px-6 py-4 border-b">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Your Events</CardTitle>
            <p className="text-sm sm:text-base text-gray-600">Manage and track your event portfolio</p>
          </CardHeader>

          {events.length === 0 ? (
            <CardContent className="text-center py-8 sm:py-12">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Get started by creating your first event</p>
              <Button
                onClick={() => navigate("/organizer/events/create")}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200 h-10 sm:h-11 w-full sm:w-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          ) : (
            <CardContent className="p-0">
              <div className="divide-y">
                {events.map((event) => (
                  <div key={event._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{event.title}</h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(event.category)}`}
                          >
                            {event.category}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                          {event.ticketsSold !== undefined && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>
                                {event.ticketsSold}/{event.totalTickets || "N/A"} tickets sold
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-0 sm:ml-4 w-full sm:w-auto">
                        <Button
                          onClick={() => navigate(`/organizer/events/edit/${event._id}`)}
                          variant="outline"
                          className="flex-1 sm:flex-none px-3 py-2 text-sm font-medium text-gray-700 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 h-10"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(event._id, event.title)}
                          disabled={deleteLoading === event._id}
                          variant="outline"
                          className="flex-1 sm:flex-none px-3 py-2 text-sm font-medium text-red-700 border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-10"
                        >
                          {deleteLoading === event._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                          ) : (
                            <Trash2 className="w-4 h-4 mr-1" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}

export default OrganizerDashboard