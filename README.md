# This package is still WIP - use at your own risk or don't use at all!!!
# shawerma [ ![Codeship Status for igorkosta/shawerma](https://app.codeship.com/projects/4b87d650-b721-0135-8837-0243d1ced2de/status?branch=master)](https://app.codeship.com/projects/258751) [![npm version](https://badge.fury.io/js/shawerma.svg)](https://badge.fury.io/js/shawerma)
We start with the sauce - `lavash` comes later!

![shawerma.jpg](shawerma.jpg)

Since we're extensively using `AWS λ`, we thouhgt that we need a bunch of
helpers that we can reuse in all our customer facing `λ`-based API.

For now we only support unified `http error` objects, `http responses` and some
`console.log()` based logging that was heavily inspired by the guys from [yubl](https://www.crunchbase.com/organization/yubl)
(they went out of business).

```js
const shawerma = require('shawerma');
const log = shawerma.log;
const HttpError = shawerma.HttpError;
const Response = shawerma.Response;
```

## HTTP Error
`HttpError` is used to create an error response that will be passed to
a callback.

`HttpError` function will take up to 3 arguments:
* statusCode
* message
* cors (defaults to `true`)

```js
const HttpError = (statusCode, message, cors = true)
```

To create a `Not authorized` error response with a `401` http status code
you would do something like this:

```js
const errorResponse = HttpError(401, `You shall not pass`);
callback(null, errorResponse);
```

If you don't provide a third `cors` argument, `HttpError` will add a `cors` header to your response `{ 'Access-Control-Allow-Origin': '*' }`

If you don't want your responses `cors`-ified pass `false` a 3rd argument.

An `HttpError` will return a `json` object with following structure:

```js
return {
  statusCode,
  body: JSON.stringify({
    statusCode,
    message
  }),
  headers
};
```

An API response will look like following:

```json
{
  "statusCode": 401,
  "message": "Not authorized"
}
```

## Response
By using `Response` function, you can create a standardized API response.
`Response` takes 3 arguments:

* statusCode
* data (defaults to `null`) - it allows you to create a `No Content` responses
* cors (defaults to `true`)

```js
const response = Response(201, `{'foo':'bar'}`);
callback(null, response);
```

If you don't provide a third `cors` argument, `Response` will add a `cors` header to your response `{ 'Access-Control-Allow-Origin': '*' }`

If you don't want your responses `cors`-ified pass `false` a 3rd argument.

```js
const response = Response(201, `{'foo':'bar'}`, true);
```

A `Response` will return a `json` object with following structure:

```js
return {
  statusCode,
  body: JSON.stringify({
    statusCode,
    data
  }),
  headers
}
```

If you pass the `data` argument, `shawerma` will wrap it in an `Array` if it's not one already.
We want to have the consistent outcome, so that we can always use the same `components` on the frontend.

If you want to create a `No Content` response, e.g. as a result of a `DELETE`
action, just pass the `statusCode` to the `Response` function, like this:

```js
const response = Response(204);
```

What you will get back is a `204 NO CONTENT` response.

With `data` passed in an API response will look like following:

```json
{
  "statusCode": 200,
  "data": [
    {
      "foo":"bar"
    },
    {
      "koo":"rra"
    }
  ]
}
```

## Log
`log` wraps `console.log` by adding the information about `log` level to it:
* `log.info(args)` - would return `INFO args`
* `log.warn(args)` - would return `WARN args`
* `log.error(args)` - would return `ERROR args`
* `log.debug(args)` - would return `DEBUG args`

`log.debug()` will be ignored if `env` variable `DEBUG_LOGGING` is not set or set to `false`

## Handler
`createHandler` function takes a function you want to run and an optional
`options` array and returns a `handler` function for your `λ`, e.g.

```
const createHandler = require('shawerma').createHandler;

createHandler(f, options)

f(event) => result || Promise<result>

options : { timeout, onSuccess, onError }
```

`timeout` defaults to 5 seconds.

The optional `onSuccess` function is called (with the result from `f`) after `f` has returned a result and before the result is returned to API Gateway.

The optional `onError` function is called (with the error object) before the error is returned to API Gateway.

```
const createHandler = require('shawerma').createHandler;
const listAll = require('./listAll')

const options = {
  timeout: 9000
}

// options is an optional parameter :)
module.exports.handler = createHandler(listAll, options)
```

IMPORTANT: whenever you create your handler with the help of `createHandler` it will check whether a user calling your function is authenticated (`event.requestContext.authorizer`) or not and whether the request is coming from the allowed `origin` (`event.headers.origin !== process.env.ORIGIN`).

Those checks are not optional yet - they will be in the future.

```
if (event.headers.origin !== process.env.ORIGIN) {
  let response = HttpError(403, `Wrong Origin`)
  return cb(null, response)
}

if (!event.requestContext.authorizer) {
  let result = HttpError(401, `Not authorized`)
  return cb(null, result)
}
```

## TODOs
* Add tests for the `handler`
