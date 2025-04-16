import express from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "../docs/swagger";
import { ENV } from "./constants/environment-vars.constants";

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

/* Swagger API Docs */
if (ENV === "dev") {
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

app.use("*", router);

export default app;
