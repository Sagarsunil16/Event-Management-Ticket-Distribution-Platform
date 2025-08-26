import Stripe from "stripe";

export interface IPaymentService {
  createPaymentIntent(amount: number,currency?: string): Promise<Stripe.PaymentIntent>;
  handleWebhookEvent(payload: Buffer, signature: string): Promise<void>;
  bookTicket(eventId: string, userId: string): Promise<void>;
}
  