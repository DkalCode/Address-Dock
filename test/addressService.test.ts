import addressService from "../src/services/address.service";
import { NULL_ADDRESS_REQUEST_ERROR } from "../src/services/address.service";

test("rejects when request is null", async () => {
  await expect(addressService.city(null)).rejects.toEqual(NULL_ADDRESS_REQUEST_ERROR);
});

test("rejects when zipcode is not 5 characters", async () => {
  const badRequest = { body: { zipcode: "12" } };
  await expect(addressService.city(badRequest)).rejects.toEqual(NULL_ADDRESS_REQUEST_ERROR);
});

test("city - valid request, expect city result", async () => {
  const goodRequest = { body: { zipcode: "14586" } };
  await addressService.city(goodRequest).then((response) => {
    if (response) {
      expect(response).toEqual("WEST HENRIETTA");
    }
    else {
      fail("addressService.city: Nothing Returned");
    }
  })

}, 30000)

test("count: null request - expect error returned", async () => {
  let error: any;
  await addressService
    .count(null)
    .then(() => {
      fail("addressService.count: Unexpected Success");
    })
    .catch((err) => {
      error = err;

    });

  expect(error).toBeDefined();
  expect(error.message).toEqual(NULL_ADDRESS_REQUEST_ERROR);
});

test("distance: null request - expect error returned", async () => {
  let error: any;
  await addressService.distance(null).then(() => {
    fail("addressService.distance: Unexpected Success");
  })
    .catch((err: Error) => {
      error = err;
    })

  expect(error).toBeDefined();
  expect(error.message).toEqual(NULL_ADDRESS_REQUEST_ERROR);
}, 60000)



