import { useState } from "react"
import { Link } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Alert, AlertDescription } from "../ui/alert"
import { Calendar, Ticket, Eye, EyeOff, UserPlus, Users, Crown } from "lucide-react"
import api from "../../services/api"

// Validation schema using Yup
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  role: Yup.string()
    .oneOf(["attendee", "organizer"], "Invalid account type")
    .required("Account type is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
})

const Register = () => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (values: {
    name: string
    email: string
    role: "attendee" | "organizer"
    password: string
    confirmPassword: string
  }, { setSubmitting }: any) => {
    setError("")
    try {
      await api.post("/users/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="border-border shadow-lg w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="bg-primary rounded-lg p-2">
                <UserPlus className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Welcome to EventHub!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Registration successful! You can now access your account.
            </CardDescription>
            <Button asChild className="w-full h-11 font-medium">
              <Link to="/login">Continue to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-foreground">Join EventHub</h1>
          <p className="text-muted-foreground">Create your account to start managing events</p>
        </div>

        {/* Register Form */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
            <CardDescription>Enter your details to create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                name: "",
                email: "",
                role: "attendee",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="h-11"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

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
                    <Label className="text-sm font-medium">Account Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFieldValue("role", "attendee")}
                        className={`flex flex-col items-center p-4 border rounded-lg transition-colors ${
                          values.role === "attendee"
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                        disabled={isSubmitting}
                      >
                        <Users
                          className={`h-6 w-6 mb-2 ${
                            values.role === "attendee" ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            values.role === "attendee" ? "text-primary" : "text-foreground"
                          }`}
                        >
                          Attendee
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">Join events</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFieldValue("role", "organizer")}
                        className={`flex flex-col items-center p-4 border rounded-lg transition-colors ${
                          values.role === "organizer"
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                        disabled={isSubmitting}
                      >
                        <Crown
                          className={`h-6 w-6 mb-2 ${
                            values.role === "organizer" ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            values.role === "organizer" ? "text-primary" : "text-foreground"
                          }`}
                        >
                          Organizer
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">Create events</span>
                      </button>
                    </div>
                    <ErrorMessage
                      name="role"
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
                        placeholder="Create a password"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="h-11 pr-10"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-sm text-destructive"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 font-medium flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register