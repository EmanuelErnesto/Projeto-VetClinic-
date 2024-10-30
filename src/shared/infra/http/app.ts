import "reflect-metadata";
import "@shared/container/index";
import express, { urlencoded } from "express";
import "express-async-errors";
import cors from "cors";
import { router } from "./routes";
import { RouteNotFound } from "./middlewares/RouteNotFound";
import { ApplicationErrorHandler } from "./middlewares/ApplicationErrorHandler";
import PinoHttp from "pino-http";
import { logger } from "@config/logger";

const app = express();

if (process.env.NODE_ENV !== "test") {
  const pinoHttp = PinoHttp({ logger });
  app.use(pinoHttp);
}

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use(RouteNotFound);
app.use(ApplicationErrorHandler);

export { app };
