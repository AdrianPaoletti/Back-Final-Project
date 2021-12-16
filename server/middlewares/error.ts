import Debug from "debug";

const debug = Debug("socialMedia:error");

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generalErrorHandler = (error, req, res, next) => {
  debug(`Some error happens: ${error.message}`);
  const message = error.code ? error.message : "General error";
  //
  res.status(error.code || 500).json({ error: message });
};

export { notFoundErrorHandler, generalErrorHandler };
