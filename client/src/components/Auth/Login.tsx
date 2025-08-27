import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from '../ui/button'
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Alert, AlertDescription } from "../ui/alert"
import { Eye, EyeOff, Calendar, Ticket } from "lucide-react"
import api from "../../services/api"
import { AuthContext } from "../../context/authContext"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  id: string
  role: "attendee" | "organizer"
}

// Validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
})

const Login = () => {
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { setToken, setRole } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (values: { email: string; password: string }, { setSubmitting }: any) => {
    setError("")
    try {
      const res = await api.post("/users/login", values)
      const token = res.data.token

      // Update context
      setToken(token)

      // Decode role
      const decoded = jwtDecode<JwtPayload>(token)
      setRole(decoded.role)

      // Redirect based on role
      if (decoded.role === "organizer") {
        navigate("/organizer/dashboard")
      } else if (decoded.role === "attendee") {
        navigate("/events")
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-primary rounded-lg p-2">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="bg-accent rounded-lg p-2">
              <Ticket className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to manage your events and tickets</p>
        </div>

        {/* Login Form */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-11"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-11 pr-10"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full h-11 font-medium" disabled={isSubmitting}>
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>

                  {/* <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-muted-foreground hover:text-primary"
                      disabled={isSubmitting}
                    >
                      Forgot your password?
                    </Button>
                  </div> */}
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login