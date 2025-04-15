import loggerService from "./logger.service";

export const NULL_ADDRESS_REQUEST_ERROR =
  "You must provide a valid Address Request.";
class AddressService {
  private static fetchUrl = "https://ischool.gccis.rit.edu/addresses/";

  constructor() {}

  public async count(addressRequest?: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (!addressRequest) {
        reject(NULL_ADDRESS_REQUEST_ERROR);
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

  public async distance(addressRequest?: any): Promise<any> {
    // Complete this
  }

  // private async getDistance(lat1: string, lon1: string, lat2: string, lon2: string) {
  //     // Defining this function inside of this private method means it's
  //     // not accessible outside of it, which is perfect for encapsulation.
  //     const toRadians = (degrees: string) => {
  //         return degrees * (Math.PI / 180);
  //     }

  //     // Radius of the Earth in KM
  //     const R = 6371;

  //     // Convert Lat and Longs to Radians
  //     const dLat = toRadians(lat2 - lat1);
  //     const dLon = toRadians(lon2 - lon1);

  //     // Haversine Formula to calculate the distance between two locations
  //     // on a sphere.
  //     const a =
  //         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //         Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
  //         Math.sin(dLon / 2) * Math.sin(dLon / 2);

  //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //     // convert and return distance in KM
  //     return R * c;
  // }
}

export default new AddressService();
