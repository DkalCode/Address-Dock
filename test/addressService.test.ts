import addressService from "../src/services/address.service";
import { NULL_ADDRESS_REQUEST_ERROR, ADDRESS_NOT_FOUND_ERROR } from "../src/services/address.service";

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
  expect(error).toEqual(NULL_ADDRESS_REQUEST_ERROR);
});

test("count: bad zipcode - expect count of 0", async () => {
  await addressService
    .count({body: {"zipcode": "12"}})
    .then((response) => {
      expect(response).toBeDefined();
      expect(response.count).toEqual(0);
    })
    .catch((err) => {
      fail("addressService.count - Unexpected Error: " + err);
    });

  
}, 60000);

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

test("distance: bad request - expect error returned", async () => {
  let error: any;
  await addressService.distance(
    {
      body: {
        addresses: [
          {
            "number": "4255",
            // Should be "E RIVER RD", this will send error
            "street": "E RIVER ROAD",
            "city": "WEST HENRIETTA",
            "state": "NY",
            "zipcode": "14586"
          },
          {
            "number": "4255",
            "street": "E RIVER RD",
            "street2": "18C",
            "city": "WEST HENRIETTA",
            "state": "NY",
            "zipcode": "14586"
          }
        ]
      }
    }).then(() => {
      fail("addressService.distance: Unexpected Success");
    }).catch((err: Error) => {
      error = err;
    })

  expect(error).toBeDefined();
  expect(error.message).toEqual(ADDRESS_NOT_FOUND_ERROR);
})

test("distance: good request - expect distance returned", async () => {
  const expectedKilometers = 0.07437772516419937;
  const expectedMiles = 0.0462161755947715;
  
  let actualKilometers;
  let actualMiles;
  

  await addressService.distance({
    body: {
      addresses: [
        {
          "number": "4255",
          "street": "E RIVER RD",
          "street2": "15C",
          "city": "WEST HENRIETTA",
          "state": "NY",
          "zipcode": "14586"
        },
        {
          "number": "4255",
          "street": "E RIVER RD",
          "street2": "18C",
          "city": "WEST HENRIETTA",
          "state": "NY",
          "zipcode": "14586"
        }
      ]
    }
  }).then((distances) => { actualKilometers = distances[0]; actualMiles = distances[1]; })
    .catch((err) => { fail("addressService.distance: Unexpected Error - " + err.message) });

    expect(actualKilometers).toBeDefined();
    expect(actualKilometers).toEqual(expectedKilometers);

    expect(actualMiles).toBeDefined();
    expect(actualMiles).toEqual(expectedMiles);
})



