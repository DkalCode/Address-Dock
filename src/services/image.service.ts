import { GOOGLE_API_TOKEN } from "../constants/environment-vars.constants";
import { QUERY_NOT_PROVIDED } from "../constants/errors.constants";
import loggerService from "./logger.service";
import addressService, { NULL_ADDRESS_REQUEST_ERROR } from "./address.service";

class ImageService {
  private static fetchUrl = "https://maps.googleapis.com/maps/api/streetview";

  constructor() {}

  public async request(request: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      if (Object.keys(request.body).length === 0) {
        loggerService
          .warning({ message: QUERY_NOT_PROVIDED, path: request.path })
          .flush();
        reject(new Error(QUERY_NOT_PROVIDED));
        return;
      }

      addressService
        .exact(request)
        .then((response) => {
          try {
            const params = new URLSearchParams({
              key: GOOGLE_API_TOKEN,
              location: response.formattedAddress,
              size: "500x500",
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
            reject(err);
            return;
          }
        })
        .catch((err) => {
          loggerService.warning({ message: err, path: request.path }).flush();
          reject(err);
        });
    });
  }
}

export default new ImageService();
