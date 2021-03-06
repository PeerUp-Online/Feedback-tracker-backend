const jwt = require('jsonwebtoken')

module.exports = (data) =>
    jwt.sign({ ...data }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY_TIME,
    })
