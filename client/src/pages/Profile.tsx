import { useEffect, useState, useContext } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { User, Mail, Lock, Camera, Save, Eye, EyeOff } from "lucide-react"
import api from "../services/api"
import { AuthContext } from "../context/authContext"

// Validation schema using Yup
const ProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  profileInfo: Yup.string()
    .max(500, "Profile info must not exceed 500 characters")
    .optional(),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .optional(),
  confirmPassword: Yup.string()
    .when("password", {
      is: (password: string) => !!password,
      then: (schema) =>
        schema
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("Confirm password is required when password is provided"),
      otherwise: (schema) => schema.optional(),
    }),
})

const Profile: React.FC = () => {
  const { token } = useContext(AuthContext)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    profileInfo: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!token) return
    setLoading(true)
    api
      .get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setInitialValues({
          name: res.data.user.name,
          email: res.data.user.email,
          profileInfo: res.data.user.profileInfo || "",
          password: "",
          confirmPassword: "",
        })
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false))
  }, [token])

  const handleSubmit = async (
    values: {
      name: string
      email: string
      profileInfo: string
      password: string
      confirmPassword: string
    },
    { setSubmitting }: any
  ) => {
    setError("")
    setMessage("")
    try {
      const payload: any = {
        name: values.name,
        profileInfo: values.profileInfo,
      }

      if (values.password) {
        payload.password = values.password
      }

      await api.put("/users/profile", payload, { headers: { Authorization: `Bearer ${token}` } })
      setMessage("Profile updated successfully")
      setInitialValues((prev) => ({ ...prev, password: "", confirmPassword: "" }))
    } catch (err: any) {
      setError(err.response?.data?.error || "Update failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !initialValues.name) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center text-white transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{initialValues.name || "Your Profile"}</h1>
                <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={ProfileSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>

                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Field
                          id="name"
                          name="name"
                          placeholder="Enter your full name"
                          type="text"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Field
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          type="email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-500"
                          disabled
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="profileInfo" className="block text-sm font-medium text-gray-700 mb-2">
                        About You
                      </label>
                      <Field
                        as="textarea"
                        id="profileInfo"
                        name="profileInfo"
                        placeholder="Tell us about yourself, your interests, or your role..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage
                        name="profileInfo"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Security Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Field
                            id="password"
                            name="password"
                            placeholder="Enter new password"
                            type={showPassword ? "text" : "password"}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            disabled={isSubmitting}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            disabled={isSubmitting}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-sm text-red-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Field
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            disabled={isSubmitting}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            disabled={isSubmitting}
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">
                      Leave password fields empty if you don't want to change your password
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Update Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            {/* Messages */}
            {message && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">{message}</p>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile