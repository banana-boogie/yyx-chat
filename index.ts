import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

// Endpoint for handling incoming events from WhatsApp API
app.post("/webhook", (req: Request, res: Response) => {
  const { body } = req;
  console.log("Received event:", body);
  // Process the incoming event here
  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
