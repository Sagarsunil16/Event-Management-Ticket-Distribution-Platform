import { useEffect, useState } from "react"
import { useNavigate, Link, useParams } from "react-router-dom"
import { Calendar, MapPin, Users, Tag, ArrowLeft, FileText } from "lucide-react"
import api from "../services/api"

const EditEvent: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const eventId = id as string

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    category: "",
    totalTickets: 10,
    ticketPrice: 0,
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    "Conference",
    "Workshop",
    "Seminar",
    "Networking",
    "Concert",
    "Festival",
    "Sports",
    "Exhibition",
    "Training",
    "Hackathon ",
    "Other",
  ]

  // Load event details
  useEffect(() => {
    if (eventId) {
      api
        .get(`/events/${eventId}`)
        .then((res) => {
          const evt = res.data
          setForm({
            title: evt.title,
            description: evt.description,
            date: evt.date.slice(0, 16),
            venue: evt.venue,
            category: evt.category,
            totalTickets: evt.totalTickets,
            ticketPrice: evt.ticketPrice || 0,
          })
        })
        .catch(() => setError("Failed to load event for editing"))
        .finally(() => setLoading(false))
    }
  }, [eventId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "totalTickets" || name === "ticketPrice" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await api.put(`/events/${eventId}`, form, {
        headers: { "Content-Type": "application/json" },
      })
      setSuccess(true)
      setTimeout(() => navigate("/organizer/dashboard"), 1200)
    } catch (err: any) {
      setError(err.response?.data?.error || "Update failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center max-w-md w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading event...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Updated Successfully!
          </h2>
          <p className="text-gray-600 mb-4">Redirecting to your dashboard...</p>
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
              <p className="mt-1 text-gray-600">Update your event details and settings</p>
            </div>
            <Link
              to="/organizer/dashboard"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border p-8 space-y-8"
        >
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-emerald-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Title */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your event..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" /> Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" /> Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  required
                  placeholder="Event venue or location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" /> Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-emerald-600" />
              Tickets
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Tickets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Tickets Available *
                </label>
                <input
                  type="number"
                  name="totalTickets"
                  value={form.totalTickets}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Ticket Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Price ($)
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={form.ticketPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-sm text-gray-500 mt-1">Leave as 0 for free events</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/organizer/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating Event...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" /> Update Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEvent
