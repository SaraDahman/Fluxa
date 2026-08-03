import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${env.PORT} is already in use.`);
  } else {
    console.error(error);
  }

  process.exit(1);
});
