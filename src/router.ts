// Disabling the rule to allow for require imports
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ENV } from "./constants/environment-vars.constants";
import loggerService from "./services/logger.service";

// Creates an instance of the express router
const router = express.Router();

// GET, POST, PUT and DELETE routes for all endpoints
// Routes will match with any endpoints
router.get("*", (req: Request, res: Response, next: NextFunction) => {
  validateEndpoint(req, res, () => {
    require(getEndpointControllerPath(req)).getRoute(req, res, next);
  });
});

router.post("*", (req: Request, res: Response, next: NextFunction) => {
  validateEndpoint(req, res, () => {
    require(getEndpointControllerPath(req)).postRoute(req, res, next);
  });
});

router.put("*", (req: Request, res: Response, next: NextFunction) => {
  validateEndpoint(req, res, () => {
    require(getEndpointControllerPath(req)).putRoute(req, res, next);
  });
});

router.delete("*", (req: Request, res: Response, next: NextFunction) => {
  validateEndpoint(req, res, () => {
    require(getEndpointControllerPath(req)).deleteRoute(req, res, next);
  });
});

/// Get the path to the endpoint controller based on the request URL
function getEndpointControllerPath(req: Request): string {
  // Splits the request URL
  const paths = req.baseUrl.split("/");

  // Checks if the request is valid
  const ext = ENV === "dev" ? "ts" : "js";
  const route = `${__dirname}/endpoints/${paths[1]}.endpoint.${ext}`;
  if (paths.length === 1 || !fs.existsSync(route) || paths[1] == "base") {
    throw new createHttpError.BadRequest();
  }

  return route;
}

/// Validate the endpoint and catch any errors that occur
/// If an error occurs, log the error and send a 404 response
function validateEndpoint(req: Request, res: Response, callback: () => void) {
  try {
    callback();
  } catch (error) {
    loggerService.debug({ message: "Not Found", path: req.path }).flush();
    res.status(404).send({
      error: {
        status: 404,
        message: "Not Found",
      },
    });
  }
}

export default router;
