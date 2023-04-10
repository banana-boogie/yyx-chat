import { Router } from "express";
import * as WebhookController from "../controllers/whatsappWebhookController";

const router = Router();

router.get("/whatsapp", WebhookController.verifyWhatsAppWebhook);

router.post("/whatsapp", WebhookController.handleWhatsAppEvent);

export default router;
