/* eslint-env jest */
'use strict'

const Normalize = require('../utils/normalize')
const event = require('./event')

test(`Create a normEvent with all headers lowercased`, () => {
  let headers = Object.keys(event.headers)
  console.log(headers)

  const normEvent = Normalize(event)
  const lowercasedHeaders = Object.keys(normEvent.headers)

  expect(headers).not.toEqual(lowercasedHeaders)
  headers = headers.map(h => { return h.toLowerCase() })
  expect(headers).toEqual(lowercasedHeaders)
})
