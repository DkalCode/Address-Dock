import loggerService from "./logger.service";

export const NULL_ADDRESS_REQUEST_ERROR =
  "You must provide an Address Request.";

class DistanceService {

  constructor() { }

  public async distance(addressRequest?: any): Promise<any> {
    // Complete this
    return new Promise<any>(async (resolve, reject) => {

      let lon1 = Number.parseFloat(addressRequest.body.lon1);
      if (isNaN(lon1)) { reject("Bad Request: Input Invalid"); }

      let lat1 = Number.parseFloat(addressRequest.body.lat1);
      if (isNaN(lat1)) { reject("Bad Request: Input Invalid"); }

      let lon2 = Number.parseFloat(addressRequest.body.lon2);
      if (isNaN(lon2)) { reject("Bad Request: Input Invalid"); }

      let lat2 = Number.parseFloat(addressRequest.body.lat2);
      if (isNaN(lat2)) { reject("Bad Request: Input Invalid"); }



      this.getDistance(lat1, lon1, lat2, lon2)
        .then((disances) => resolve(disances))
        .catch((err) => {
          loggerService
            .error({
              path: "/distance",
              message: `${(err as Error).message}`,
            })
            .flush();
          reject(err);
        });

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

export default new DistanceService();