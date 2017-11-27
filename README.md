# shawerma
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
* data
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

`data` is always an `Array`. Even if you create an object, we'll wrap it into an array. We want to have the consistent outcome, so that we can always use the same `components` on the frontend.


An API response will look like following:

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
