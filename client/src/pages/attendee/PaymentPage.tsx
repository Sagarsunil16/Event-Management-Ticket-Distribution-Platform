import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../../services/api";
import { AuthContext } from "../../context/authContext";

// Initialize Stripe with your publishable key
console.log("Stripe Publishable Key:",import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY );
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

interface PaymentFormProps {
  eventId: string;
  eventTitle: string;
  eventPrice: number;
}
interface Event {
  _id: string
  title: string
  price: number
  date: string
  venue: string
  category: string
  description?: string
  ticketsSold?: number
  totalTickets?: number
}

const PaymentForm: React.FC<PaymentFormProps> = ({ eventId, eventTitle, eventPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch PaymentIntent client_secret from backend
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPaymentIntent = async () => {
      try {
        const response = await api.post(
          "/payment/create-payment-intent",
          { eventId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClientSecret(response.data.clientSecret);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to initialize payment.");
      }
    };

    fetchPaymentIntent();
  }, [eventId, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Payment form not loaded correctly.");
      setLoading(false);
      return;
    }

    try {
      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name", // You can collect this dynamically
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed.");
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Book the ticket after successful payment
        try {
          await api.post(
            "/tickets/book",
            { eventId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPaymentSuccess(true);
          setError(null);
        } catch (err: any) {
          setError(err.response?.data?.error || "Failed to book ticket after payment.");
        }
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center">
        <div className="bg-green-100 rounded-lg p-6 mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
          <p className="text-green-700">Your ticket for {eventTitle} has been booked.</p>
        </div>
        <button
          onClick={() => navigate("/tickets/my")}
          className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
        >
          View My Tickets
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay for {eventTitle}</h3>
        <p className="text-gray-600 mb-4">Total: ${eventPrice.toFixed(2)}</p>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
            }}
          />
        </div>
      </div>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || !clientSecret || loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          !stripe || !clientSecret || loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </div>
        ) : (
          `Pay $${eventPrice.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

const PaymentPage: React.FC = () => {
  const { id } = useParams();
  const eventId = id;
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) return;
    api
      .get(`/events/${eventId}`)
      .then((res) => setEvent(res.data))
      .catch(() => setError("Failed to load event details."));
  }, [eventId]);

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error || "Event not found."}</p>
          <button
            onClick={() => navigate("/events")}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <Elements stripe={stripePromise}>
          <PaymentForm
            eventId={eventId!}
            eventTitle={event.title}
            eventPrice={event.price || 0}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;