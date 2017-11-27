'use strict';

const HttpError = (statusCode, message, cors = true) => {

  let headers = {};

  if (cors) {
    headers = {
      'Access-Control-Allow-Origin': '*'
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
