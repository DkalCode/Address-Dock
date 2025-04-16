import fs from "fs";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { ENV } from "./constants/environment-vars.constants";
import loggerService from "./services/logger.service";

const router = express.Router();

router.get("*", (req: Request, res: Response, next: NextFunction) => {
  getEndpointControllerPath(req)
    .then(async (path) => {
      require(path).getRoute(req, res, next);
    })
    .catch((err: HttpError) => {
      loggerService
        .debug({ message: err.message, path: req.originalUrl })
        .flush();
      res.status(err.status).send({
        error: {
          status: err.status,
          message: err.message,
        },
      });
    });
});

router.post("*", (req: Request, res: Response, next: NextFunction) => {
  getEndpointControllerPath(req)
    .then((path) => {
      require(path).postRoute(req, res, next);
    })
    .catch((err: HttpError) => {
      loggerService
        .debug({ message: err.message, path: req.originalUrl })
        .flush();
      res.status(err.status).send({
        error: {
          status: err.status,
          message: err.message,
        },
      });
    });
});

router.put("*", (req: Request, res: Response, next: NextFunction) => {
  getEndpointControllerPath(req)
    .then((path) => {
      require(path).putRoute(req, res, next);
    })
    .catch((err: HttpError) => {
      loggerService
        .debug({ message: err.message, path: req.originalUrl })
        .flush();
      res.status(err.status).send({
        error: {
          status: err.status,
          message: err.message,
        },
      });
    });
});

router.delete("*", (req: Request, res: Response, next: NextFunction) => {
  getEndpointControllerPath(req)
    .then((path) => {
      require(path).deleteRoute(req, res, next);
    })
    .catch((err: HttpError) => {
      loggerService
        .debug({ message: err.message, path: req.originalUrl })
        .flush();
      res.status(err.status).send({
        error: {
          status: err.status,
          message: err.message,
        },
      });
    });
});

function getEndpointControllerPath(req: Request): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const paths = req.baseUrl.split("/");

    const ext = ENV === "dev" ? "ts" : "js";

    const route = `${__dirname}/endpoints/${paths[1]}.endpoint.${ext}`;

    if (paths.length === 1 || !fs.existsSync(route) || paths[1] == "base") {
      reject(new createHttpError.BadRequest());
      return;
    }

    resolve(route);
  });
}

export default router;
