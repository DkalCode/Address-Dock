import addressService from "../src/services/address.service";
import { NULL_ADDRESS_REQUEST_ERROR } from "../src/services/address.service";

test("count: null request - expect error returned", async () => {
  let error;
  await addressService
    .count(null)
    .then(() => {
      fail("addressService.count: Unexpected Success");
    })
    .catch((err) => {
      error = err;
    });

  expect(error).toBeDefined();
  expect(error).toEqual(NULL_ADDRESS_REQUEST_ERROR);
});
