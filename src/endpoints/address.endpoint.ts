import { NextFunction, Request, response, Response } from "express";
import baseEndpoint from "./base.endpoint";
import addressService from "../services/address.service";
import responseWrapper from "../services/response.service";

import {
  RESPONSE_STATUS_OK,
  RESPONSE_STATUS_FAIL,
  RESPONSE_EVENT_READ,
} from "../constants/generic.constants";

class AddressEndpoint extends baseEndpoint {
  public post(req: Request, res: Response, next: NextFunction) {
    super.executeSubRoute(addressEndpoint, req, res, next);
  }

  /**
   * @swagger
   * /address/count:
   *   post:
   *     summary: Returns the count of addresses given a request body.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [zipcode, city]
   *             properties:
   *               zipcode:
   *                 type: string
   *                 description: A valid zipcode (e.g. "14586").
   *               city:
   *                 type: string
   *                 description: A city name (e.g. "Rochester").
   *     tags: [address]
   *     responses:
   *       200:
   *         description: Successful response
   *       400:
   *         description: Bad request
   */
  private count_post(req: Request, res: Response, next: NextFunction) {
    addressService
      .count(req)
      .then((response) => {
        res
          .status(200)
          .send(
            responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response)
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

  /**
   * @swagger
   * /address/request:
   *   post:
   *     summary: Returns an array of addresses given a request body.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [zipcode, city]
   *             properties:
   *               zipcode:
   *                 type: string
   *                 description: A valid zipcode (e.g. "14586").
   *               city:
   *                 type: string
   *                 description: A city name (e.g. "Rochester").
   *     tags: [address]
   *     responses:
   *       200:
   *         description: Successful response
   *       400:
   *         description: Bad request
   */
  private request_post(req: Request, res: Response, next: NextFunction) {
    addressService
      .request(req)
      .then((response) => {
        res
          .status(200)
          .send(
            responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, response)
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

  private distance_post(req: Request, res: Response, next: NextFunction) {
    addressService
      .distance(req)
      .then((distances) => {
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





const addressEndpoint = new AddressEndpoint();

const getRoute = addressEndpoint.get;
const postRoute = addressEndpoint.post;
const putRoute = addressEndpoint.put;
const deleteRoute = addressEndpoint.delete;

export { getRoute, postRoute, putRoute, deleteRoute };
