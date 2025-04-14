import { NextFunction, Request, response, Response } from "express";
import baseEndpoint from "./base.endpoint";
import distanceService from "../services/distance.service";
import responseWrapper from "../services/response.service";

import {
    RESPONSE_STATUS_OK,
    RESPONSE_STATUS_FAIL,
    RESPONSE_EVENT_READ,
  } from "../constants/generic.constants";
  
class DistanceEndpoint extends baseEndpoint {
    public post(req: Request, res: Response, next: NextFunction) {
        super.executeSubRoute(distanceEndpoint, req, res, next);
    }


    private request_post(req: Request, res: Response, next: NextFunction) {
        distanceService
          .distance(req)
          .then((distances: Array<number>) => {
            res
              .status(200)
              .send(
                responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, { "Distance (KM)": distances[0], "Distance (MI)": distances[1] })
              );
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



const distanceEndpoint = new DistanceEndpoint();

const getRoute = distanceEndpoint.get;
const postRoute = distanceEndpoint.post;
const putRoute = distanceEndpoint.put;
const deleteRoute = distanceEndpoint.delete;

export { getRoute, postRoute, putRoute, deleteRoute };