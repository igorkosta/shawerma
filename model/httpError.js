'use strict';

const Origins = require('../lib/corSettings');

const HttpError = (statusCode, message, cors = true) => {

  let headers = {};

  // const origins = Origins(event);

  if (cors) {
    headers = {
      'Access-Control-Allow-Origin': process.env.ORIGIN || '*',
      'Vary': 'Origin'
    }
  }

  return {
    statusCode,
    body: JSON.stringify({
      statusCode,
      message
    }),
    headers
  };
};

module.exports = HttpError;
