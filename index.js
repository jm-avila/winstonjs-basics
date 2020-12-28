const express = require("express");
const app = express();
const port = 3000;

const logger = require("./logger");

const handler = (func) => (req, res) => {
  const logMetaData = { endpoint: req.originalUrl };
  try {
    logger.info("server.handler.begun", logMetaData);
    func(req, res, logger);
  } catch (e) {
    logger.error("server.handler.failed", logMetaData);
    res.send("Oh no, somethin did not go well.");
  }
};

app.use((req, res, done) => {
  logger.info(req.originalUrl);
  done();
});

app.get(
  "/success",
  handler((req, res) => {
    res.send("Yay!");
  })
);

app.get(
  "/error",
  handler((req, res) => {
    throw new Error("Doh!");
  })
);

app
  .listen(port, () => console.log(`Example app listening on port: ${port}`))
  .on("listening", () =>
    logger.info(`Application started on http://localhost:${port}`)
  );
