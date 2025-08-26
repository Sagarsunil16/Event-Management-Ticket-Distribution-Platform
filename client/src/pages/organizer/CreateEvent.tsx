import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Calendar, MapPin, Users, Tag, FileText, /* Upload */ ArrowLeft } from "lucide-react"
import api from "../../services/api"

const CreateEvent: React.FC = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    category: "",
    totalTickets: 10,
    price: 0,
    // image: null as File | null, // removed for now
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [imagePreview, setImagePreview] = useState<string | null>(null)

  const categories = [
    "Conference",
    "Workshop",
    "Concert",
    "Sports",
    "Festival",
    "Networking",
    "Exhibition",
    "Seminar",
    "Hackathon",
    "Other",
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: name === "totalTickets" || name === "price" ? Number(value) : value,
    })
  }

  // ❌ Image upload removed
  /*
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm({ ...form, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  */

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setLoading(true)

  try {
    await api.post("/events", form, {
      headers: { "Content-Type": "application/json" },
    })

    setSuccess(true)
    setTimeout(() => navigate("/organizer/dashboard"), 1500)
  } catch (err: any) {
    setError(err.response?.data?.error || "Failed to create event")
  } finally {
    setLoading(false)
  }
}


  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Created Successfully!
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
              <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
              <p className="mt-1 text-gray-600">
                Fill in the details to create your event and start selling tickets
              </p>
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
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
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
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date & Time *
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
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Venue *
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
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category *
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

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave as 0 for free events
                </p>
              </div>
            </div>
          </div>

          {/* Tickets (image upload removed) */}
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

              {/* ❌ Event Image Removed */}
              {/*
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4 inline mr-1" />
                  Event Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="..."
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Event preview" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}
              </div>
              */}
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
              disabled={loading}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEvent
