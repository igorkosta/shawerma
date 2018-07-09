/* eslint-env jest */
'use strict'

const Cors = require('../lib/cors')
const event = require('./event')

process.env.ORIGIN = 'http://localhost:8080, http://127.0.0.1'

test(`Creates an array of allowed origins`, () => {
  const expected = ['http://localhost:8080', 'http://127.0.0.1']
  expect(Cors.validOrigins()).toEqual(expected)
})

test(`Check if an event has a valid origin`, () => {
  expect(Cors.checkOrigin(event)).toEqual(true)
})

test(`Check if an event has a wrong origin`, () => {
  event.headers.origin = 'https://wrong.com'
  expect(Cors.checkOrigin(event)).toEqual(false)
})

test(`Check if process.env.ORIGIN: '*'`, () => {
  process.env.ORIGIN = ''
  expect(Cors.checkOrigin(event)).toEqual(true)
})

test(`CORS has to be enabled by default`, () => {
  expect(Cors.enabled()).toEqual(true)
})

test(`Check if CORS is disabled`, () => {
  // CORS: true is set in the env
  // that's why it's a string and not a boolean
  process.env.CORS = 'false'
  expect(Cors.enabled()).toEqual(false)
})
