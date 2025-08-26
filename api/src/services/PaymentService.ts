import Stripe from 'stripe';
import dotenv from 'dotenv'
import { IEventService } from './interfaces/IEventService';
import { ITicketService } from './interfaces/ITicketService';
import { IPaymentService } from './interfaces/IPaymentService';
import { CustomError } from '../utils/CustomError';
dotenv.config()
export class PaymentService implements IPaymentService {
  private _stripe: Stripe;
  private _eventService: IEventService
  private _ticketService: ITicketService

  constructor(eventService:IEventService, ticketService:ITicketService) {
    this._eventService = eventService,
    this._ticketService = ticketService
    this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'usd', metadata?: Record<string, string>) {
    return this._stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
      metadata,
    });
  }

  async handleWebhookEvent(payload: Buffer, signature: string): Promise<void> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new CustomError('Stripe webhook secret is missing.',400);
    }

    try {
      const event = this._stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      // Handle specific event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const eventId = paymentIntent.metadata?.eventId;
          const userId = paymentIntent.metadata?.userId;

          if (!eventId || !userId) {
            console.error('Missing eventId or userId in PaymentIntent metadata');
            return;
          }

          // Book the ticket
          try {
            await this.bookTicket(eventId, userId);
            console.log(`Ticket booked for event ${eventId} and user ${userId}`);
          } catch (err) {
            console.error(`Failed to book ticket for event ${eventId}:`, err);
            throw err;
          }
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (err: any) {
      console.error('Webhook verification failed:', err.message);
      throw new CustomError(err.message,400);
    }
  }

   async bookTicket(eventId: string, userId: string): Promise<void> {
    // Validate event and ticket availability
    const event = await this._eventService.getEventById(eventId);
    if (!event) {
      throw new CustomError('Event not found',404);
    }
    if (event.totalTickets !== undefined && event.ticketsSold !== undefined) {
      const ticketsLeft = event.totalTickets - event.ticketsSold;
      if (ticketsLeft <= 0) {
        throw new CustomError('No tickets available',400);
      }
    }
    await this._ticketService.bookTicket(eventId, userId);
  }
}
