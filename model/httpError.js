'use strict'

const Cors = require('../lib/cors')

const HttpError = (statusCode, message, cors = true) => {
  let headers = {}

  if (cors) {
    headers = {
      'Access-Control-Allow-Origin': Cors.internals.origin,
      'Vary': 'Origin'
    }
  }

  return {
    statusCode,
    body: JSON.stringify(message),
    headers
  }
}

module.exports = HttpError
