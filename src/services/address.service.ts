import loggerService from "./logger.service";

export const NULL_ADDRESS_REQUEST_ERROR =
  "You must provide an Address Request.";
class AddressService {
  private static fetchUrl = "https://ischool.gccis.rit.edu/addresses/";

  constructor() { }

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
}

export default new AddressService();
