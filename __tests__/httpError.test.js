/* eslint-env jest */
'use strict'

const HttpError = require('../model/httpError')

const corsHeader = {
  'Access-Control-Allow-Origin': '*',
  'Vary': 'Origin'
}

test(`Creates a not authorized error response with CORS`, () => {
  const notAuthorized = 'Not authorized'
  const err = HttpError(401, notAuthorized)
  expect(err.statusCode).toBe(401)
  expect(err.body).toBe(JSON.stringify(notAuthorized))
  expect(err.headers).toEqual(corsHeader)
})

test(`Creates a not authorized error response without CORS`, () => {
  const notAuthorized = 'Not authorized'
  const err = HttpError(401, notAuthorized, false)
  expect(err.statusCode).toBe(401)
  expect(err.body).toBe(JSON.stringify(notAuthorized))
  expect(err.headers).toEqual({})
})
