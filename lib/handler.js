'use strict'

const Promise = require('bluebird')
const log = require('./log')
const normalize = require('../utils/normalize')
const HttpError = require('../model/httpError')
const Cors = require('./cors')
const Auth = require('./auth')

function doNothing () {}

function swallowExn (f, arg) {
  try {
    f(arg)
  } catch (err) {
    log.error(err, err.stack)
  }
}

function createHandler (f, options = {}) {
  let timeout = options.timeout || 5000
  let onSuccess = options.onSuccess || doNothing
  let onError = options.onError || doNothing
  let auth = (options.auth === undefined) ? Auth() : options.auth

  return (event, context, cb) => {
    // create a normalized event
    // where every header is lowercased
    // don't mutate the original event
    const normEvent = normalize(event)
    context.callbackWaitsForEmptyEventLoop = false
    log.info(JSON.stringify(event, null, 4))

    if (Cors.enabled() && !Cors.checkOrigin(normEvent)) {
      let response = HttpError(403, `Wrong Origin`)
      return cb(null, response)
    }

    if (auth && !event.requestContext.authorizer) {
      let result = HttpError(401, `Not authorized`)
      return cb(null, result)
    }

    // bluebird-fy the fetch results Promise so we can use timeout on it
    Promise
      .resolve(f(normEvent))
      .then(results => {
        log.debug(JSON.stringify(results, null, 4))

        swallowExn(onSuccess, results)
        return cb(null, results)
      })
      .timeout(timeout)
      .catch(Promise.TimeoutError, err => {
        log.error(`Task timed out after ${timeout} milliseconds: ${err}`)
        let response = HttpError(504, 'timed out')
        return cb(null, response)
      })
      .catch(err => {
        log.warn('Failed to process request:\n', JSON.stringify(event))
        log.error(err, err.stack)

        swallowExn(onError, err)

        if (err.status) {
          return cb(null, JSON.stringify(err))
        } else {
          let response = HttpError(500, `Server error. Request Id [${context.awsRequestId}]`)
          return cb(null, response)
        }
      })
  }
}

module.exports = {
  createHandler
}
