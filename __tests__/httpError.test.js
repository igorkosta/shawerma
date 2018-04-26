'use strict';

const HttpError = require('../model/httpError');

const corsHeader = {
  'Access-Control-Allow-Origin': '*',
  'Vary': 'Origin'
};

test(`Creates a not authorized error response with CORS`, () => {
  const err = HttpError(401, `Not authorized`);
  const notFound = {
    statusCode: 401,
    message: 'Not authorized'
  };
  expect(err.statusCode).toBe(401);
  expect(err.body).toBe(JSON.stringify(notFound));
  expect(err.headers).toEqual(corsHeader);
});

test(`Creates a not authorized error response without CORS`, () => {
  const err = HttpError(401, `Not authorized`, false);
  const notFound = {
    statusCode: 401,
    message: 'Not authorized'
  };
  expect(err.statusCode).toBe(401);
  expect(err.body).toBe(JSON.stringify(notFound));
  expect(err.headers).toEqual({});
});
