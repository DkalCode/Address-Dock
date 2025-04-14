import { NextFunction, Request, Response } from "express";
import baseEndpoint from "./base.endpoint";
import responseWrapper from "../services/response.service";

import {
  RESPONSE_STATUS_OK,
  RESPONSE_EVENT_READ,
  RESPONSE_STATUS_FAIL,
} from "../constants/generic.constants";
import imageService from "../services/image.service";

class ImageEndpoint extends baseEndpoint {
  public get(req: Request, res: Response, next: NextFunction) {
    super.executeSubRoute(imageEndpoint, req, res, next);
  }

  private image_get(req: Request, res: Response, next: NextFunction) {
    imageService
      .request(req.query)
      .then((response) => {
        fetch(response.url)
          .then((response) => response.blob())
          .then(async (image) => {
            res.setHeader("Content-Type", "image/jpeg");
            res.send(Buffer.from(await image.arrayBuffer()));
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

const imageEndpoint = new ImageEndpoint();

const getRoute = imageEndpoint.get;
const postRoute = imageEndpoint.post;
const putRoute = imageEndpoint.put;
const deleteRoute = imageEndpoint.delete;

export { getRoute, postRoute, putRoute, deleteRoute };
