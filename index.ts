import dotenv from "dotenv";

dotenv.config();

import connectDB from "./database/index";
import { initializeServer } from "./server/index";

const port = process.env.PORT ?? process.env.SERVER_PORT;

(async () => {
  try {
    await connectDB(process.env.MONGODB_STRING);
    initializeServer(+port);
  } catch (error) {
    process.exit(1);
  }
})();
