import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import pinoHttp from "pino-http";

import { env } from "./config/env";
import routes from "./routes";

import { logger } from "./config/logger";

import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";

const app = express();

// Logging for HTTP requests and responses using Pino
app.use(pinoHttp({ logger }));

// Security for setting various HTTP headers to protect the app from well-known web vulnerabilities

app.use(helmet());

// CORS for allowing cross-origin requests from the client application

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Body Parsing for JSON and URL-encoded data

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies for handling cookies in requests and responses

app.use(cookieParser());

// Compression for response bodies to reduce size and improve performance

app.use(compression());

app.use("/api/v1", routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
