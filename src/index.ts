import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";

// import cache from "./data/cache";
import router from "./routes";

const app = express().use(bodyParser.json()); // creates express http server

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

app.use(router);
