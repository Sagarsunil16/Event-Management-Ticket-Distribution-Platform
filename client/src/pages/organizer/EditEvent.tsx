import { useEffect, useState } from "react"
import { useNavigate, Link, useParams } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Calendar, MapPin, Users, Tag, ArrowLeft, FileText } from "lucide-react"
import api from "../../services/api"

// Validation schema using Yup
const EventSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .required("Event title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters")
    .required("Description is required"),
  date: Yup.date()
    .min(new Date(), "Event date must be in the future")
    .required("Date and time are required"),
  venue: Yup.string()
    .min(3, "Venue must be at least 3 characters")
    .max(200, "Venue must not exceed 200 characters")
    .required("Venue is required"),
  category: Yup.string()
    .oneOf(
      [
        "Conference",
        "Workshop",
        "Seminar",
        "Networking",
        "Concert",
        "Festival",
        "Sports",
        "Exhibition",
        "Training",
        "Hackathon",
        "Other",
      ],
      "Invalid category"
    )
    .required("Category is required"),
  totalTickets: Yup.number()
    .min(1, "At least 1 ticket is required")
    .integer("Number of tickets must be an integer")
    .required("Total tickets are required"),
  price: Yup.number()
    .min(0, "Price cannot be negative")
    .required("Price is required"),
})

const EditEvent: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const eventId = id as string

  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    category: "",
    totalTickets: 10,
    price: 0,
  })

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
    "Hackathon",
    "Other",
  ]

  // Load event details
  useEffect(() => {
    if (eventId) {
      api
        .get(`/events/${eventId}`)
        .then((res) => {
          const evt = res.data
          setInitialValues({
            title: evt.title,
            description: evt.description,
            date: evt.date.slice(0, 16),
            venue: evt.venue,
            category: evt.category,
            totalTickets: evt.totalTickets,
            price: evt.price || 0,
          })
        })
        .catch(() => setError("Failed to load event for editing"))
        .finally(() => setLoading(false))
    }
  }, [eventId])

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any
  ) => {
    setError("")
    try {
      await api.put(`/events/${eventId}`, values, {
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
        <Formik
          initialValues={initialValues}
          validationSchema={EventSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="bg-white rounded-xl shadow-sm border p-8 space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <Field
                      type="text"
                      name="title"
                      placeholder="Enter event title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      rows={4}
                      placeholder="Describe your event..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" /> Date & Time *
                    </label>
                    <Field
                      type="datetime-local"
                      name="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>

                  {/* Venue */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" /> Venue *
                    </label>
                    <Field
                      type="text"
                      name="venue"
                      placeholder="Event venue or location"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="venue"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" /> Category *
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isSubmitting}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-sm text-red-600"
                    />
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
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Tickets Available *
                    </label>
                    <Field
                      type="number"
                      name="totalTickets"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="totalTickets"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>

                  {/* Ticket Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Price ($)
                    </label>
                    <Field
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-sm text-red-600"
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
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default EditEvent