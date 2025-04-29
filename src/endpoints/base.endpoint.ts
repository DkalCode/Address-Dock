// Because this class is used as a base class for other endpoints, we need to disable the no-unused-vars rule
// to avoid linting errors when the methods are not used in the base class itself.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

// Base endpoint class that all endpoints in the application will extend from
// Handles basic operations (get, post, put, delete) 
class BaseEndpoint {
  public constructor() {}

  // Get method for the endpoint
  public get(req: Request, res: Response, next: NextFunction) {
    throw new createHttpError.BadRequest();
  }

  // Post method for the endpoint
  public post(req: Request, res: Response, next: NextFunction) {
    throw new createHttpError.BadRequest();
  }

  // Put method for the endpoint
  public put(req: Request, res: Response, next: NextFunction) {
    throw new createHttpError.BadRequest();
  }

  // Delete method for the endpoint
  public delete(req: Request, res: Response, next: NextFunction) {
    throw new createHttpError.BadRequest();
  }


  // Execute the subroute based on the request method and endpoint method
  public executeSubRoute(
    endPointMethod: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let subRoute = req.originalUrl.split("/")[2];
    subRoute = `${subRoute}_${req.method.toLowerCase()}`;

    // Checks if the subroute exists, calls method if it does, error if it does not.
    const temp = endPointMethod[subRoute as keyof typeof endPointMethod];
    if (!temp) {
      throw new createHttpError.BadRequest();
    }

    temp(req, res, next);
  }
}

export default BaseEndpoint;
