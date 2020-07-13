'use strict'

const Cors = require('../lib/cors')
const Security = require('../lib/security')

const Response = (
  statusCode,
  data = null,
  cors = true,
  security = Security()
) => {
  let headers = {}

  if (cors) {
    headers = {
      'Access-Control-Allow-Origin': Cors.internals.origin,
      'Access-Control-Allow-Credentials': true,
      'Vary': 'Origin'
    }
  }

  if (security) {
    headers = {
      ...headers,
      ...{
        'Strict-Transport-Security': 'max-age=63072000; includeSubdomains; preload',
        'Content-Security-Policy': `default-src 'none'; img-src * data:; manifest-src 'self'; script-src 'self' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://storage.googleapis.com; style-src 'self' https://*.googleapis.com 'unsafe-inline'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'self'; font-src 'self' https://*.gstatic.com; connect-src ${Cors.internals.origin} https://cognito-idp.eu-west-1.amazonaws.com https://cognito-idp.eu-west-2.amazonaws.com https://cognito-idp.us-east-1.amazonaws.com https://cognito-idp.us-east-2.amazonaws.com;`,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'same-origin'
      }}
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
