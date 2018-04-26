'use strict';

const Promise   = require('bluebird');
const log       = require('./log');
const HttpError = require('../model/httpError');

function doNothing () {
}

function swallowExn (f, arg) {
  try {
    f(arg);
  } catch (err) {
    log.error(err, err.stack);
  }
}

function createHandler (f, options = {}) {
  let timeout   = options.timeout   || 5000;
  let onSuccess = options.onSuccess || doNothing;
  let onError   = options.onError   || doNothing;

  return (event, context, cb) => {
    context.callbackWaitsForEmptyEventLoop = false;
    log.debug(JSON.stringify(event, null, 4));

    if (event.headers.origin !== process.env.ORIGIN) {
      let response = HttpError(403, `Wrong Origin`)
      return cb(null, response)
    }

    if (!event.requestContext.authorizer) {
      let result = HttpError(401, `Not authorized`)
      return cb(null, result)
    }

    // bluebird-fy the fetch results Promise so we can use timeout on it
    Promise
      .resolve(f(event))
      .then(results => {
        log.debug(JSON.stringify(results, null, 4));

        swallowExn(onSuccess, results);
        return cb(null, results);
      })
      .timeout(timeout)
      .catch(Promise.TimeoutError, err => {
        log.error(`Task timed out after ${timeout} milliseconds`);
        let response = HttpError(504, 'timed out');
        return cb(null, response);
      })
      .catch(err => {
        log.warn('Failed to process request:\n', JSON.stringify(event));
        log.error(err, err.stack);

        swallowExn(onError, err);

        if (err.status) {
          return cb(null, JSON.stringify(err));
        } else {
          let response = HttpError(500, `Server error. Request Id [${context.awsRequestId}]`);
          return cb(null, response)
        }
      });
  };
}

module.exports = {
  createHandler
};
