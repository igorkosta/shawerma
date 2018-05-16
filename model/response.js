'use strict'

const Cors = require('../lib/cors')

const Response = (statusCode, data = null, cors = true) => {
  let headers = {}

  if (cors) {
    headers = {
      'Access-Control-Allow-Origin': Cors.internals.origin,
      'Vary': 'Origin'
    }
  }

  if (!data) {
    return {
      statusCode,
      headers
    }
  }

  data = Array.isArray(data) ? data : [data]

  return {
    statusCode,
    body: JSON.stringify({
      statusCode,
      data
    }),
    headers
  }
}

module.exports = Response
