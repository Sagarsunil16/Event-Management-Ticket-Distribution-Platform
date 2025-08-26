import { paymentController } from '../container/di';
import { Router }from "express";
import express from 'express'
const webhookRouter = Router();

webhookRouter.post('/',express.raw({ type: 'application/json' }),paymentController.handleWebhook.bind(paymentController));

export default webhookRouter;
