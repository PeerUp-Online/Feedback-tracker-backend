const AppError = require('../helpers/appError')

module.exports = (req, res, next) => async (schema) => {
    try {
        schema.validate(req.body)
        next()
    } catch (error) {
        return next(new AppError(error.mesaage, 422))
    }
}
