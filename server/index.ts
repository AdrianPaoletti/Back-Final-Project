import chalk from "chalk";
import express from "express";
import cors from "cors";
import Debug from "debug";
import morgan from "morgan";
import usersRoutes from "./routes/usersRoutes";
import videosRoutes from "./routes/videosRoutes";
import commentsRoutes from "./routes/commentsRoutes";
import Auth from "./middlewares/auth";
import { notFoundErrorHandler, generalErrorHandler } from "./middlewares/error";

const debug = Debug("finalProject:server");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`Escuchando en el puerto ${port}`));
      resolve(server);
    });

    server.on("error", () => {
      debug(chalk.red("Ha habido un error al iniciar el servidor."));
      reject();
    });
  });

app.use("/users", usersRoutes);
app.use("/videos", Auth, videosRoutes);
app.use("/comments", Auth, commentsRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

export { app, initializeServer };
