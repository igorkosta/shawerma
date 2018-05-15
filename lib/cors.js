'use strict'

// think about a proper default
let internals = {
  origin: '*'
}

const validOrigins = () => {
  const origins = !process.env.ORIGIN ? '*' : Array.from(process.env.ORIGIN.replace(/\s/g, '').split(','))

  return origins
}

const checkOrigin = (event) => {
  if (validOrigins() === '*') {
    return true
  }

  if (validOrigins().includes(event.headers.origin)) {
    internals.origin = event.headers.origin
    return true
  }

  // should we really set it to null
  // and why doesn't it work?
  internals.origin = null
  return false
}

module.exports = {
  validOrigins,
  checkOrigin,
  internals
}
