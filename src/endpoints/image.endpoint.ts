import { NextFunction, Request, Response } from "express";
import baseEndpoint from "./base.endpoint";
import responseWrapper from "../services/response.service";

import {
  RESPONSE_EVENT_READ,
  RESPONSE_STATUS_FAIL,
} from "../constants/generic.constants";
import imageService from "../services/image.service";

// Image endpoint class built off the base endpoint
class ImageEndpoint extends baseEndpoint {
  public post(req: Request, res: Response, next: NextFunction) {
    super.executeSubRoute(imageEndpoint, req, res, next);
  }

// Calls the google streetview API to get an image of the address
  private request_post(req: Request, res: Response) {
    imageService
      .request(req)
      .then((response) => {
        fetch(response.url)
          .then((response) => response.blob())
          .then(async (image) => {
            res.setHeader("Content-Type", "image/jpeg");
            res.status(200).send(Buffer.from(await image.arrayBuffer()));
          });
      })
      .catch((err) => {
        res
          .status(400)
          .send(
            responseWrapper(RESPONSE_STATUS_FAIL, RESPONSE_EVENT_READ, err)
          );
      });
  }
}

// Creates an image endpoint object
// This object will be used to handle all requests to the image endpoint
const imageEndpoint = new ImageEndpoint();

// Sets the get, post, put and delete routes for the image endpoint object
const getRoute = imageEndpoint.get;
const postRoute = imageEndpoint.post;
const putRoute = imageEndpoint.put;
const deleteRoute = imageEndpoint.delete;

export { getRoute, postRoute, putRoute, deleteRoute };

// Adds box shadows to the image endpoint object
