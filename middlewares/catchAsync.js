/**
 * A middleware to handle async errors
 * and then send to global error handler middleware
 */
module.exports = fn => (req, res, next) => {
    fn(req, res, next).catch(next)
}
