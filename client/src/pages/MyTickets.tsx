import { useEffect, useState, useContext } from "react"
import api from "../services/api"
import { AuthContext } from "../context/authContext"
import {
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Ticket,
} from "lucide-react"

interface MyTicket {
  _id: string
  eventId: {
    _id: string
    title: string
    description: string
    date: string
    venue: string
    category: string
  }
  bookingDate: string
  status: string
}

const MyTickets: React.FC = () => {
  const { token } = useContext(AuthContext)
  const [tickets, setTickets] = useState<MyTicket[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    api
      .get("/tickets/my")
      .then((res) => {
        console.log(res, "response")
        setTickets(res.data)
      })
      .catch(() => setError("Failed to load tickets"))
      .finally(() => setLoading(false))
  }, [token])

  const cancelTicket = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this ticket? This action cannot be undone.")) {
      return
    }

    setCancellingId(id)
    try {
      await api.post("/tickets/cancel", { ticketId: id })
      setTickets((t) => t.map((ticket) => (ticket._id === id ? { ...ticket, status: "cancelled" } : ticket)))
    } catch {
      alert("Failed to cancel ticket")
    } finally {
      setCancellingId(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"
    switch (status) {
      case "active":
        return `${baseClasses} bg-emerald-100 text-emerald-800`
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
  }

  const toggleDetails = (id: string) => {
    setExpandedTicket(expandedTicket === id ? null : id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-gray-600">Loading your tickets...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tickets Found</h2>
            <p className="text-gray-600 mb-6">You haven't booked any tickets yet.</p>
            <a
              href="/events"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse Events
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">Manage your event tickets and bookings</p>
        </div>

        {/* Tickets Grid */}
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Ticket className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate max-w-xs">
                        {ticket.eventId.title}
                      </h3>
                      <p className="text-xs text-gray-500">ID: {ticket._id.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(ticket.status)}
                    <span className={`${getStatusBadge(ticket.status)} text-xs px-2 py-1`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {ticket.eventId.date
                        ? new Date(ticket.eventId.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Date TBD"}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleDetails(ticket._id)}
                    className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                  >
                    <span>{expandedTicket === ticket._id ? "Hide Details" : "Show Details"}</span>
                    {expandedTicket === ticket._id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {expandedTicket === ticket._id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Full Event Date</p>
                          <p className="text-sm">
                            {ticket.eventId.date
                              ? new Date(ticket.eventId.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Date TBD"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Booked On</p>
                          <p className="text-sm">
                            {new Date(ticket.bookingDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Ticket Information</p>
                      <p className="text-sm text-gray-700">
                        Venue: {ticket.eventId.venue}
                      </p>
                      <p className="text-sm text-gray-700">
                        Category: {ticket.eventId.category}
                      </p>
                      <p className="text-sm text-gray-700">
                        {ticket.eventId.description}
                      </p>
                    </div>

                    {ticket.status === "active" && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => cancelTicket(ticket._id)}
                          disabled={cancellingId === ticket._id}
                          className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {cancellingId === ticket._id ? (
                            <span className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              <span>Cancelling...</span>
                            </span>
                          ) : (
                            "Cancel Ticket"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyTickets
