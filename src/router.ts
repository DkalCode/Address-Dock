import fs from "fs";
import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ENV } from "./constants/environment-vars.constants";
import loggerService from "./services/logger.service";

const router = express.Router();

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

function getEndpointControllerPath(req: Request): string {
  const paths = req.baseUrl.split("/");

  const ext = ENV === "dev" ? "ts" : "js";
  const route = `${__dirname}/endpoints/${paths[1]}.endpoint.${ext}`;
  if (paths.length === 1 || !fs.existsSync(route) || paths[1] == "base") {
    throw new createHttpError.BadRequest();
  }

  return route;
}

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
