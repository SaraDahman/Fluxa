import pino from "pino";

// 1. Define explicit transport options for development
const transport =
  process.env.NODE_ENV === "development"
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          // Formats the timestamp into a readable locale format
          translateTime: "SYS:standard",
        },
      })
    : undefined;

// 2. Instantiate the logger cleanly without passing undefined keys
export const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    // Fallback configurations for production
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);
