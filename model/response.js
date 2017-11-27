'use strict';

const Response = (statusCode, data, cors = true) => {

  let headers = {};
  data = Array.isArray(data) ? data : [data]
  if (cors) {
    headers = {
      'Access-Control-Allow-Origin': '*'
    }
  }

  return {
    statusCode,
    body: JSON.stringify({
      statusCode,
      data
    }),
    headers
  }
};

module.exports = Response;
