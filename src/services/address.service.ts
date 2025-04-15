import { QUERY_MISSING_PARAMETERS } from "../constants/errors.constants";
import { AddressResult } from "../types/types";
import Validator from "../utility/validator.utility";
import loggerService from "./logger.service";

export const NULL_ADDRESS_REQUEST_ERROR = "You must provide an Address Request";

const ADDRESS_NOT_FOUND_ERROR = "Address not found";

class AddressService {
  private static fetchUrl = "https://ischool.gccis.rit.edu/addresses/";

  constructor() { }

  public async count(addressRequest?: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (!addressRequest) {
        reject(new Error(NULL_ADDRESS_REQUEST_ERROR));
        return;
      }

      this.request(addressRequest)
        .then((response: Array<Object>) => {
          resolve({
            count: response.length,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async city(cityRequest?: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      //console.log(cityRequest.body.zipcode.length);
      if (!cityRequest || cityRequest.body.zipcode.length != 5) {
        console.log(`Please provide a valid zipcode`);            //console for method specific handling
        reject(NULL_ADDRESS_REQUEST_ERROR);                       //full reject for generic class handling
        return;
      }
      console.log(`Fetching data`);
      fetch(AddressService.fetchUrl, {
        method: "POST",
        body: JSON.stringify(cityRequest.body),
      })
        .then(async (response) => {
          let json = await response.json() as any;
          //console.log(json);
            resolve(json[0].city);
        })
        .catch((err) => {
          loggerService
            .error({
              path: "/address/city",
              message: `${(err as Error).message}`,
            })
            .flush();
          reject(err);
        });
    });
  }



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
      if (Object.keys(request.body).length === 0) {
        reject(new Error(NULL_ADDRESS_REQUEST_ERROR));
        return;
      }

      if (
        Validator.isNotNullOrUndefined([
          request.body.zipcode,
          request.body.city,
          request.body.state,
          request.body.number,
          request.body.street,
        ])
      ) {
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
            loggerService
              .warning({ message: ADDRESS_NOT_FOUND_ERROR, path: request.path })
              .flush();
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
          loggerService
            .warning({ message: formattedError, path: request.path })
            .flush();
          reject(new Error(formattedError));
          return;
        });
    });
  }

  public async distance(addressRequest?: any): Promise<any> {
    // Complete this
    return new Promise<any>(async (resolve, reject) => {

      if (!addressRequest) {
        reject(new Error(NULL_ADDRESS_REQUEST_ERROR));
        return;
      }

      try {
        let newRequest = { body: addressRequest.body.addresses[0] };
        
        let address1 = await this.exact(newRequest);
        let address2 = await this.exact({ body: addressRequest.body.addresses[1] });

        this.getDistance(address1.latitude, address1.longitude, address2.latitude, address2.longitude)
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
    })


  }

  private async getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Defining this function inside of this private method means it's
    // not accessible outside of it, which is perfect for encapsulation.
    const toRadians = (degrees: number) => {
      return degrees * (Math.PI / 180);
    }

    // Radius of the Earth in KM
    const R = 6371;

    // Convert Lat and Longs to Radians
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    // Haversine Formula to calculate the distance between two locations
    // on a sphere.
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // convert and return distance in KM & distance in MI
    return [R * c, R * c * 0.62137119];
  }
}

export default new AddressService();
