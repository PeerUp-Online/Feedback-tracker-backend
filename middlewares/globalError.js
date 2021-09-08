const chalk = require('chalk')
const AppError = require('../utils/appError')

/**
 * Show full errors during development using
 * `handleDevError` function
 */
const handleDevError = (err, res) => {
    console.error(chalk.redBright('Error: ', err.message))

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        trace: err.stack,
    })
}
/**
 *  Hide error details during production using
 * `handleProdError` function
 */
const handleProdError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Ahh something went very wrong!',
        })
    }
}
/**
 * Customize DB cast errors during production using
 * `handleCastError` function
 */
const handleCastError = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data: ${errors.join(' ')}`

    return new AppError(message, 400)
}

const handleDuplicatesError = err => {
    const value = err.message.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, '')

    const message = `Duplicate value found: '${value}' , Please use another value.`
    return new AppError(message, 400)
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        handleDevError(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { message: err.message, ...err }

        if (err.name === 'CastError') {
            error = handleCastError(error)
        }
        if (err.code === 11000) {
            error = handleDuplicatesError(error)
        }
        if (err.name === 'ValidationError') {
            error = handleValidationError(error)
        }

        handleProdError(error, res)
    }
}
