import Debug from "debug";
import chalk from "chalk";
import mongoose from "mongoose";

const debug = Debug("finalProject:database");
const connectDB = (connectionString) =>
  new Promise<void>((resolve, reject) => {
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret._v;
      },
    });
    mongoose.connect(connectionString, (error) => {
      if (error) {
        debug(chalk.red("No se ha podido iniciar la DB"));
        debug(error.message);
        reject();
        return;
      }
      debug(chalk.green("DB conected"));
      resolve();
    });
    mongoose.connection.on("close", () => {
      debug("Desconectado de la base de datos");
    });
  });

export default connectDB;
