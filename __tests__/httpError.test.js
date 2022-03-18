/* eslint-env jest */
'use strict'

const HttpError = require('../model/httpError')

const corsHeader = {
  'Access-Control-Allow-Origin': '*',
  'Vary': 'Origin'
}

test(`Creates a not authorized error response with CORS`, () => {
  const notFound = 'Not authorized'
  const err = HttpError(401, notFound)
  expect(err.statusCode).toBe(401)
  expect(err.body).toBe(JSON.stringify(notFound))
  expect(err.headers).toEqual(corsHeader)
})

test(`Creates a not authorized error response without CORS`, () => {
  const notFound = 'Not authorized'
  const err = HttpError(401, notFound, false)
  expect(err.statusCode).toBe(401)
  expect(err.body).toBe(JSON.stringify(notFound))
  expect(err.headers).toEqual({})
})
