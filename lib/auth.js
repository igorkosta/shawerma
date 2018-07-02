'use strict'

module.exports = () => {
  let auth = true

  if (process.env.AUTH === 'false') {
    auth = false
  }

  return auth
}
