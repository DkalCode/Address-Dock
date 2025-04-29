import express from "express";
import cors from "cors";

import router from "./router";

const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(cors({ credentials: true, origin: "*" }));

app.locals.HEALTH_CHECK_ENABLED = true;
app.get("/health", (_, res) => {
  if (app.locals.HEALTH_CHECK_ENABLED) {
    res.end("OK\n");
    return;
  }

  res.status(503).end("Server shutting down!");
});

app.use(express.json());

app.use("*", router);

export default app;
