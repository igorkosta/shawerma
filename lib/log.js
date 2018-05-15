'use strict'

const log = (level, args) => {
  let debugEnabled = process.env.DEBUG_LOGGING === 'true'

  if (debugEnabled) {
    console.log('DEBUG LOGGING ENABLED')
  }

  if (level === 'DEBUG' && !debugEnabled) {
    return
  }

  return console.log(level, args)
}

// default log(args) to log('INFO', args)
module.exports.info = (args) => log('INFO', args)
module.exports.warn = (args) => log('WARN', args)
module.exports.error = (args) => log('ERROR', args)
module.exports.debug = (args) => log('DEBUG', args)
