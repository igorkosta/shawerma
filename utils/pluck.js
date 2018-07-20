'use strict'

const pluck = (keys, obj) => {
  return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {})
}

module.exports = pluck
