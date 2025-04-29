import { NextFunction, Request, Response } from "express";
import baseEndpoint from "./base.endpoint";
import addressService from "../services/address.service";
import responseWrapper from "../services/response.service";

import {
  RESPONSE_STATUS_OK,
  RESPONSE_STATUS_FAIL,
  RESPONSE_EVENT_READ,
} from "../constants/generic.constants";

// AddressEndpoint class extnded off the baseEnpoint class
class AddressEndpoint extends baseEndpoint {
  public post(req: Request, res: Response, next: NextFunction) {
    super.executeSubRoute(addressEndpoint, req, res, next);
  }

  // Gets the count of addresses returned from the query
  private count_post(req: Request, res: Response) {
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

  // gets the city from the address provided
  private city_post(req: Request, res: Response) {
    addressService
      .city(req)
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

  // Base request method
  private request_post(req: Request, res: Response) {
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

  // gets the distance between two addresses
  // returns the distance in kilometers and miles
  private distance_post(req: Request, res: Response) {
    addressService
      .distance(req)
      .then((distances: Array<number>) => {
        res.status(200).send(
          responseWrapper(RESPONSE_STATUS_OK, RESPONSE_EVENT_READ, {
            kilometers: distances[0],
            miles: distances[1],
          })
        );
      })
      .catch((err: Error) => {
        res
          .status(400)
          .send(
            responseWrapper(
              RESPONSE_STATUS_FAIL,
              RESPONSE_EVENT_READ,
              err.message
            )
          );
      });
  }

  // Gets an exact address based on the request
  private exact_post(req: Request, res: Response) {
    addressService
      .exact(req)
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
}

// Creates an address endpoint object
// This object will be used to handle all requests to the address endpoint
const addressEndpoint = new AddressEndpoint();

// Sets the get, post, put and delete routes for the address endpoint object
const getRoute = addressEndpoint.get;
const postRoute = addressEndpoint.post;
const putRoute = addressEndpoint.put;
const deleteRoute = addressEndpoint.delete;

export { getRoute, postRoute, putRoute, deleteRoute };
