'use strict';

// think about a proper default
let internals = {
  origin: '*'
}

const validOrigins = () => {
  const origins = !process.env.ORIGIN ? '*' : Array.from(process.env.ORIGIN.replace(/\s/g,'').split(','));

  return origins;
}

const check = (event) => {
  if (validOrigins() === '*') {
    internals.origin = '*'
    return false
  }

  if (validOrigins().includes(event.headers.origin)) {
    internals.origin = event.headers.origin
    return false
  }

  // should we really set it to null
  // and why doesn't it work?
  internals.origin = null
  return true
}

module.exports = {
  validOrigins,
  check,
  internals
}
