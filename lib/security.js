module.exports = () => {
  let security = true
  if (process.env.SECURITY === 'false') {
    security = false
  }

  return security
}
