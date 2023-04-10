import express from "express";
import webhookRouter from "./webhooks";

const router = express.Router();

router.use("/webhook", webhookRouter);

export default router;
