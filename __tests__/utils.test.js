/* eslint-env jest */
'use strict'

const Normalize = require('../utils/normalize')
const pluck = require('../utils/pluck')
const event = require('./event')

test(`Create a normEvent with all headers lowercased`, () => {
  let headers = Object.keys(event.headers)

  const normEvent = Normalize(event)
  const lowercasedHeaders = Object.keys(normEvent.headers)

  expect(headers).not.toEqual(lowercasedHeaders)
  headers = headers.map(h => { return h.toLowerCase() })
  expect(headers).toEqual(lowercasedHeaders)
})

test(`Should pluck the provided keys from the json object`, () => {
  const object = {
    'id': 1,
    'foo': 'bar',
    'bar': 'foo',
    'remove': 'me'
  }

  const plucked = {
    'id': 1,
    'foo': 'bar'
  }

  expect(pluck(['id', 'foo'], object)).toEqual(plucked)
})
