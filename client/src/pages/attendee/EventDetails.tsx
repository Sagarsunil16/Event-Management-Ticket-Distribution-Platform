import { useEffect, useState, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Calendar, MapPin, Tag, Users, Clock } from "lucide-react"
import api from "../../services/api"
import { AuthContext } from "../../context/authContext"

interface Event {
  _id: string
  title: string
  date: string
  venue: string
  category: string
  description?: string
  price?: number
  ticketsSold?: number
  totalTickets?: number
}

const EventDetails: React.FC = () => {
  const { id } = useParams()
  const eventId = id
  const navigate = useNavigate()
  const { token } = useContext(AuthContext)

  const [event, setEvent] = useState<Event | null>(null)
  const [error, setError] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!eventId) return
    api
      .get(`/events/${eventId}`)
      .then((res) => setEvent(res.data))
      .catch(() => setError("Failed to load event details."))
  }, [eventId])

  const ticketsLeft =
    event && event.totalTickets !== undefined && event.ticketsSold !== undefined
      ? event.totalTickets - event.ticketsSold
      : 0

  const handleBookNow = async () => {
    if (!token) {
      navigate("/login")
      return
    }

    if (event?.price && event.price > 0) {
      navigate(`/events/${eventId}/payment`, {
        state: {
          eventId,
          eventTitle: event.title,
          eventPrice: event.price,
        },
      })
      return
    }

    setLoading(true)
    try {
      await api.post("/tickets/book", { eventId })
      setBookingSuccess(true)
      setError("")
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to book ticket.")
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Music: "bg-purple-100 text-purple-800 border-purple-200",
      Sports: "bg-blue-100 text-blue-800 border-blue-200",
      Technology: "bg-green-100 text-green-800 border-green-200",
      Business: "bg-gray-100 text-gray-800 border-gray-200",
      Arts: "bg-pink-100 text-pink-800 border-pink-200",
      Food: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      fullDate: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/events")}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  const dateInfo = formatDate(event.date)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Date Display */}
            <div className="lg:col-span-1">
              <div className="aspect-square bg-white/10 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm p-6">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{dateInfo.day}</div>
                  <div className="text-2xl uppercase">{dateInfo.month}</div>
                  <div className="text-lg mt-2">{dateInfo.time}</div>
                  <div className="text-sm opacity-80 mt-1">{dateInfo.fullDate}</div>
                </div>
              </div>
            </div>

            {/* Event Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(event.category)}`}
                >
                  <Tag className="w-4 h-4 inline mr-1" />
                  {event.category}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6">{event.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{dateInfo.fullDate}</p>
                    <p className="text-emerald-100">{dateInfo.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.venue}</p>
                    <p className="text-emerald-100">Event Venue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description || "No description available for this event."}
              </p>
            </div>

            {/* Event Stats */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Event Statistics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{event.ticketsSold || 0}</p>
                  <p className="text-gray-600">Tickets Sold</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{ticketsLeft}</p>
                  <p className="text-gray-600">Tickets Left</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-8">
              <div className="text-center mb-6">
                <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                  <div className="text-3xl font-bold text-emerald-600">
                    {event.price === 0 ? "FREE" : `$${event.price?.toFixed(2)}`}
                  </div>
                  <p className="text-gray-600">per ticket</p>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    {ticketsLeft > 0 ? `${ticketsLeft} tickets available` : "Sold out"}
                  </span>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-6 mb-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">✓</span>
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Booking Successful!</h3>
                    <p className="text-green-700">Your ticket has been booked successfully.</p>
                  </div>
                  <button
                    onClick={() => navigate("/tickets/my")}
                    className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                  >
                    View My Tickets
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleBookNow}
                  disabled={ticketsLeft <= 0 || loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    ticketsLeft <= 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Booking...
                    </div>
                  ) : ticketsLeft <= 0 ? (
                    "Sold Out"
                  ) : (
                    "Book Now"
                  )}
                </button>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails