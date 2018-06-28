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

  // it's `Origin` on aws and `origin` locally
  // we have to solve this problem
  if (validOrigins().includes((event.headers['Origin'] || event.headers.origin))) {
    internals.origin = event.headers['Origin'] || event.headers.origin
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
