'use strict'

// keep the keys that are provided
const include = (keys, obj) => {
  return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {})
}

// remove all keys except the ones provided
const exclude = (keys, obj) => {
  const keysToKeep = Object.keys(obj).filter((elt) => {
    return !keys.includes(elt)
  })
  return include(keysToKeep, obj)
}

module.exports = {
  include,
  exclude
}
