const jwt = require('jsonwebtoken')
const { promisify } = require('util')

module.exports = async (token) => await promisify(jwt.verify)(token, process.env.JWT_SECRET)
