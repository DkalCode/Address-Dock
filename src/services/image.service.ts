import createHttpError from "http-errors";
import { GOOGLE_API_TOKEN } from "../constants/environment-vars.constants";
import { LOCATION_NOT_PROVIDED } from "../constants/errors.constants";
import loggerService from "./logger.service";

class ImageService {
  private static fetchUrl = "https://maps.googleapis.com/maps/api/streetview";

  constructor() {}

  public async request(imageParams?: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (!imageParams || !imageParams.location) {
        reject(new createHttpError.BadRequest(LOCATION_NOT_PROVIDED));
        return;
      }

      try {
        const params = new URLSearchParams({
          key: GOOGLE_API_TOKEN,
          location: imageParams.location,
          size: imageParams.size || "500x500",
        });

        fetch(ImageService.fetchUrl + `?${params}`, {
          method: "GET",
        })
          .then(async (response) => {
            resolve(response);
          })
          .catch((err) => {
            loggerService
              .error({
                path: "/image/request",
                message: `${(err as Error).message}`,
              })
              .flush();
            reject(err);
          });
      } catch (err) {
        reject(new Error(LOCATION_NOT_PROVIDED));
        return;
      }
    });
  }
}

export default new ImageService();
