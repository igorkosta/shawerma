'use strict';

const Response = require('../model/response');

const list = [
  {
    "foo": "bar",
    "click": "clack"
  },
  {
    "koo": "rra",
    "trick": "track"
  }
];

const item = {
  "koo": "rra",
  "doo": "rra"
};

test(`Creates a response with CORS`, () => {
  const response = Response(201, item);
  const expected = {
    "statusCode":201,
    "data":[{
      "koo":"rra",
      "doo":"rra"
    }]
  };
  const corsHeader = {'Access-Control-Allow-Origin': '*'}
  expect(response.statusCode).toBe(201);
  expect(response.body).toBe(JSON.stringify(expected));
  expect(response.headers).toEqual(corsHeader);
});

test(`Creates a response without CORS`, () => {
  const response = Response(201, list, false);
  const expected = {
    "statusCode":201,
    "data": list
  }
  expect(response.statusCode).toBe(201);
  expect(response.body).toBe(JSON.stringify(expected));
  expect(response.headers).toEqual({});
});
