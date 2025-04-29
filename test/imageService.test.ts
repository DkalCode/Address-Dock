import { QUERY_NOT_PROVIDED } from "../src/constants/errors.constants";
import imageService from "../src/services/image.service";

/*
 *  imageService.request:
 *  negative test cases
 */
test("imageService.request: null request - expect error returned", async () => {
  await imageService
    .request(null)
    .then(() => {
      fail("imageService.request: Unexpected Success");
    })
    .catch((error) => {
      expect(error).toBeDefined();
      expect(error.message).toEqual(QUERY_NOT_PROVIDED);
    });
});

test("imageService.request: empty request - expect error returned", async () => {
  await imageService
    .request({})
    .then(() => {
      fail("imageService.request: Unexpected Success");
    })
    .catch((error) => {
      expect(error).toBeDefined();
      expect(error.message).toEqual(QUERY_NOT_PROVIDED);
    });
});

/*
 *  imageService.request:
 *  positive test cases
 */
test("imageService.request: valid request - expected 200 status", async () => {
  await imageService
    .request({
      body: {
        number: "4255",
        street: "E RIVER RD",
        city: "WEST HENRIETTA",
        state: "NY",
        zipcode: "14586",
      },
    })
    .then((response) => {
      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
      expect(response.headers.get("Content-Type")).toEqual("image/jpeg");
    })
    .catch((err) => {
      fail("imageService.request: Unexpected Error");
    });
}, 30000);
