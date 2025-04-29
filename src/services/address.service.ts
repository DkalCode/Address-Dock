/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-async-promise-executor */
import { QUERY_MISSING_PARAMETERS } from "../constants/errors.constants";
import { AddressResult } from "../types/types";
import Validator from "../utility/validator.utility";
import loggerService from "./logger.service";

export const NULL_ADDRESS_REQUEST_ERROR = "You must provide an Address Request";

export const ADDRESS_NOT_FOUND_ERROR = "Address not found";

class AddressService {
  private static fetchUrl = "https://ischool.gccis.rit.edu/addresses/";

  constructor() {}

  // Count number of addresses returned by the request to the API
  public async count(addressRequest?: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      // Check if addressRequest is null and reject if it is
      if (!addressRequest) {
        reject(NULL_ADDRESS_REQUEST_ERROR);
        return;
      }

      // Check if the addressRequest body has a page parameter included
      // If it does, simply run the request once and return the count of the response
      // If it doesn't, run the request in a loop until the response size is less than 1000
      // and return the total count of all responses combined
      if (addressRequest.body.page != undefined) {
        this.request(addressRequest)
          .then((response: Array<object>) => {
            resolve({
              count: response.length,
            });
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        // Combined count of all addresses from all requests
        let count = 0;
        // Current page number to be requested
        let page = 1;
        // Response of the current request
        let responseSize = 1000;
        // While the response size is 1000 (max size per request), continue to run requests, incrementing the page number each time
        // Once the response returns a size less than 1000, we know we have all the addresses and can return the count
        // do :)
        while (responseSize === 1000) {
          addressRequest.body.page = page;
          await this.request(addressRequest)
            .then((response) => {
              // Sets the new response size to the length of the response
              // and increments the count by the length of the response
              // Increments the page number for the next request
              responseSize = response.length;
              count += response.length;
              page++;
            })
            .catch((err) => {
              reject(err);
              return;
            });
          }
          resolve({
            count: count,
          });
        
      }
    });
  }

  public async city(cityRequest?: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (!cityRequest || cityRequest.body.zipcode.length != 5) {
        loggerService
          .debug({ message: NULL_ADDRESS_REQUEST_ERROR, path: "/address/city" })
          .flush();
        reject(NULL_ADDRESS_REQUEST_ERROR);
        return;
      }
      fetch(AddressService.fetchUrl, {
        method: "POST",
        body: JSON.stringify(cityRequest.body),
      })
        .then(async (response) => {
          const json = (await response.json()) as any;
          if (json[0].city != undefined) resolve(json[0].city);
        })
        .catch((err) => {
          loggerService
            .error({ message: err.message, path: "/address/city" })
            .flush();
          reject(err);
        });
    });
  }

  // Fetch the address endpoint with the user provided request
  // Resolves with the response from the API
  public async request(addressRequest?: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      fetch(AddressService.fetchUrl, {
        method: "POST",
        body: JSON.stringify(addressRequest.body),
      })
        .then(async (response) => {
          resolve(await response.json());
        })
        .catch((err) => {
          loggerService
            .error({
              path: "/address/request",
              message: `${(err as Error).message}`,
            })
            .flush();
          reject(err);
        });
    });
  }

  public async exact(request: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (!request || Object.keys(request.body).length === 0) {
        loggerService.debug({ message: NULL_ADDRESS_REQUEST_ERROR }).flush();
        reject(new Error(NULL_ADDRESS_REQUEST_ERROR));
        return;
      }

      if (
        Validator.isNullOrUndefined([
          request.body.zipcode,
          request.body.city,
          request.body.state,
          request.body.number,
          request.body.street,
        ])
      ) {
        loggerService.debug({ message: QUERY_MISSING_PARAMETERS }).flush();
        reject(new Error(QUERY_MISSING_PARAMETERS));
        return;
      }

      this.request(request)
        .then((response) => {
          const results: AddressResult[] = response;

          const normalize = (str: string) => str.trim().toUpperCase();

          const output = results.find((result) => {
            return (
              normalize(result.number) === normalize(request.body.number) &&
              normalize(result.street) === normalize(request.body.street) &&
              normalize(result.street2 || "") ===
                normalize(request.body.street2 || "")
            );
          });

          if (!output) {
            reject(new Error(ADDRESS_NOT_FOUND_ERROR));
            loggerService.warning({ message: ADDRESS_NOT_FOUND_ERROR }).flush();
            return;
          }

          if (output.street2) {
            output.formattedAddress = `${output.number} ${output.street} ${output.street2}, ${output.city}, ${output.state} ${output.zipcode}`;
          } else {
            output.formattedAddress = `${output.number} ${output.street}, ${output.city}, ${output.state} ${output.zipcode}`;
          }

          resolve(output);
        })
        .catch((error) => {
          const formattedError =
            "Exception Caught in address.service.ts -> \n exact -> \n this.request " +
            error.message;
          loggerService.warning({ message: formattedError }).flush();
          reject(new Error(formattedError));
          return;
        });
    });
  }

  // Calculate the distance between two addresses using the Haversine formula
  // This method takes in an addressRequest object that contains two addresses
  // and returns the distance between them in kilometers and miles
  public async distance(addressRequest?: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (!addressRequest || Object.keys(addressRequest.body).length === 0) {
        loggerService.debug({ message: NULL_ADDRESS_REQUEST_ERROR }).flush();
        reject(new Error(NULL_ADDRESS_REQUEST_ERROR));
        return;
      }

      if (
        Validator.isNullOrUndefined([
          addressRequest.body.addresses[0],
          addressRequest.body.addresses[1]
        ])
      ) {
        loggerService.debug({ message: QUERY_MISSING_PARAMETERS }).flush();
        reject(new Error(QUERY_MISSING_PARAMETERS));
        return;
      }

      try {
        // Uses the addressRequest object to get the two exact addresses from the user provided request
        const address1 = await this.exact({
          body: addressRequest.body.addresses[0],
        });
        const address2 = await this.exact({
          body: addressRequest.body.addresses[1],
        });

        // Gets the distance between the two addresses using the exact addresses latitudes and longitudes
        this.getDistance(
          address1.latitude,
          address1.longitude,
          address2.latitude,
          address2.longitude
        )
          // Resolves with the distance in kilometers and miles
          .then((disances) => resolve(disances))
          .catch((err) => {
            loggerService
              .error({
                path: "/distance",
                message: `${err.message + "in address.service"}`,
              })
              .flush();
            reject(err);
          });
      } catch (err: any) {
        loggerService
          .warning({ message: err.message, path: "/address/distance" })
          .flush();
        reject(err);
        return;
      }
    });
  }

  // Takes in two sets of latitude and longitude coordinates and returns the distance between them in kilometers and miles
  // This method uses the Haversine formula to calculate the distance between two points on a sphere
  private async getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    // Defining this function inside of this private method means it's
    // not accessible outside of it, which is perfect for encapsulation.
    const toRadians = (degrees: number) => {
      return degrees * (Math.PI / 180);
    };

    // Radius of the Earth in KM
    const R = 6371;

    // Convert Lat and Longs to Radians
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    // Haversine Formula to calculate the distance between two locations
    // on a sphere.
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // convert and return distance in KM & distance in MI
    return [R * c, R * c * 0.62137119];
  }
}

export default new AddressService();
