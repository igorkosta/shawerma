/* eslint-env jest */
'use strict'

const Security = require('../lib/security')

test(`Default SECURITY setting is true`, () => {
  const expected = true
  expect(Security()).toEqual(expected)
})

test(`Set process.env.SECURITY to false to disable it`, () => {
  process.env.SECURITY = 'false'
  expect(Security()).toEqual(false)
})
