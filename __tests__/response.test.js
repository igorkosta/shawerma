/* eslint-env jest */
'use strict'

const Cors = require('../lib/cors')
const Response = require('../model/response')

const list = [
  {
    'foo': 'bar',
    'click': 'clack'
  },
  {
    'koo': 'rra',
    'trick': 'track'
  }
]

const item = {
  'koo': 'rra',
  'doo': 'rra'
}

const corsHeaders = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Vary': 'Origin'
}

const securityHeaders = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubdomains; preload',
  'Content-Security-Policy': `default-src 'none'; img-src * data:; manifest-src 'self'; script-src 'self' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://storage.googleapis.com; style-src 'self' https://*.googleapis.com 'unsafe-inline'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'self'; font-src 'self' https://*.gstatic.com; connect-src ${Cors.internals.origin} https://cognito-idp.eu-west-1.amazonaws.com https://cognito-idp.eu-west-2.amazonaws.com https://cognito-idp.us-east-1.amazonaws.com https://cognito-idp.us-east-2.amazonaws.com;`,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'same-origin'
}

test(`Creates a response with CORS`, () => {
  const response = Response(201, item, true, false)
  const expected = {
    'statusCode': 201,
    'data': [{
      'koo': 'rra',
      'doo': 'rra'
    }]
  }
  expect(response.statusCode).toBe(201)
  expect(response.body).toBe(JSON.stringify(expected))
  expect(response.headers).toEqual(corsHeaders)
})

test(`Creates a response without CORS`, () => {
  const response = Response(201, list, false, false)
  const expected = {
    'statusCode': 201,
    'data': list
  }
  expect(response.statusCode).toBe(201)
  expect(response.body).toBe(JSON.stringify(expected))
  expect(response.headers).toEqual({})
})

test(`Creates a response without response body`, () => {
  const response = Response(204)
  expect(response.statusCode).toBe(204)
  expect(response.headers).toEqual({...corsHeaders, ...securityHeaders})
})

test(`Creates a response with Security Headers`, () => {
  const response = Response(201, item)
  const expected = {
    'statusCode': 201,
    'data': [{
      'koo': 'rra',
      'doo': 'rra'
    }]
  }
  expect(response.statusCode).toBe(201)
  expect(response.body).toBe(JSON.stringify(expected))
  console.log(`HEADERS: ${JSON.stringify(response.headers, null, 2)}`)
  expect(response.headers).toEqual({...corsHeaders, ...securityHeaders})
})
