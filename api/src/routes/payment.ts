import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { paymentController } from '../container/di';

const paymentRouter = Router();

paymentRouter.post('/create-payment-intent', authenticateJWT, paymentController.createPaymentIntent.bind(paymentController));

export default paymentRouter;
