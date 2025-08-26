import { Request, Response, NextFunction } from "express";
import { IPaymentService } from "../services/interfaces/IPaymentService";
import { AuthRequest } from "../middleware/auth";
import { CustomError } from "../utils/CustomError";
import { IEventService } from "../services/interfaces/IEventService";

export class PaymentController {
  private _paymentService: IPaymentService;
  private _eventService: IEventService;

  constructor(paymentService: IPaymentService, eventService: IEventService) {
    this._paymentService = paymentService;
    this._eventService = eventService;
  }

  async createPaymentIntent(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { eventId } = req.body;
      const event = await this._eventService.getEventById(eventId);
      if (!event) throw new CustomError("Event not Found", 404);
      if (event.price === 0) {
        res
          .status(400)
          .json({ error: "This event is free, no payment necessary" });
        return;
      }

      if (event.totalTickets !== undefined && event.ticketsSold !== undefined) {
        const ticketsLeft = event.totalTickets - event.ticketsSold;
        if (ticketsLeft <= 0) {
          throw new CustomError("No tickets available", 400);
        }
      }

      const amount = Math.round(event.price * 100);
      const paymentIntent = await this._paymentService.createPaymentIntent(
        amount
      );
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
      next(err);
    }
  }


  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'] as string;
      if (!signature) {
        throw new CustomError('Missing Stripe signature', 400);
      }
      await this._paymentService.handleWebhookEvent(req.body, signature);
      res.status(200).send('Webhook received');
    } catch (err: any) {
      console.error('Webhook error:', err);
      res.status(400).json({ error: err.message });
    }
  }
}
