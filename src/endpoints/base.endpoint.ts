// Because this class is used as a base class for other endpoints, we need to disable the no-unused-vars rule
// to avoid linting errors when the methods are not used in the base class itself.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

class BaseEndpoint {
  public constructor() {}

  public get(req: Request, res: Response, next: NextFunction) {
    throw new createHttpError.BadRequest();
  }

  public post(req: Request, res: Response, next: NextFunction) {
    throw new createHttpError.BadRequest();
  }

  public put(req: Request, res: Response, next: NextFunction) {
    throw new createHttpError.BadRequest();
  }

  public delete(req: Request, res: Response, next: NextFunction) {
    throw new createHttpError.BadRequest();
  }

  public executeSubRoute(
    endPointMethod: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let subRoute = req.originalUrl.split("/")[2];
    subRoute = `${subRoute}_${req.method.toLowerCase()}`;

    const temp = endPointMethod[subRoute as keyof typeof endPointMethod];
    if (!temp) {
      throw new createHttpError.BadRequest();
    }

    temp(req, res, next);
  }
}

export default BaseEndpoint;
