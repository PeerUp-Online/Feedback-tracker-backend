const catchAsync = require('../helpers/catchAsync')
const AppError = require('../helpers/appError')
const User = require('../models/user.model')
const verifyToken = require('../helpers/verifyToken')

module.exports = catchAsync(async (req, res, next) => {
    // Check if `req` has any headers attached

    let token

    if (req.cookies.token) {
        token = req.cookies.token
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    /**
     * if no token found, send back an App Error to the client
     */
    if (!token) {
        return next(
            new AppError(
                `You are not logged in, Please authenticate to access.`,
                401
            )
        )
    }

    /**
     * If token is found, check if it's valid
     * Look for the user in the DB
     */
    const verifiedToken = await verifyToken(token)

    const freshedUser = await User.findById(verifiedToken.id)

    /**
     * if no user found, send back an App Error to the client
     */
    if (!freshedUser) {
        res.cookie('token', null)

        return next(
            new AppError(
                `The token belonging to this user, does no longer exists.`,
                401
            )
        )
    }

    if (freshedUser.isPasswordChangedAfter(verifiedToken.iat)) {
        res.cookie('token', null)

        return next(
            new AppError(
                `User recently changed password, please login again.`,
                401
            )
        )
    }

    // finally
    req.user = freshedUser
    next()
})
