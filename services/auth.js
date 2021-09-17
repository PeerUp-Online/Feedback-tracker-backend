const crypto = require('crypto')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModal')
const signToken = require('../utils/signToken')
const sendEmail = require('../utils/email')
const verifyToken = require('../utils/verifyToken')

const ResetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params
    const { password, passwordConfirm } = req.body

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
        return next(new AppError(`Token is invalid or has expired`, 400))
    }

    user.password = password
    user.passwordConfirm = passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()

    const signedToken = signToken({ id: user._id, name: user.name })

    res.status(200).json({
        status: 'success',
        token: signedToken,
    })
})

const ForgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body

    if (!email) {
        return next(new AppError(`Please provide an email address`, 401))
    }

    // Get user
    const user = await User.findOne({ email })

    if (!user) {
        return next(
            new AppError(`There is no user with the given email address.`, 404)
        )
    }

    // Generate a random token
    const resetToken = user.createResetToken()
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/auth/resetPassword/${resetToken}`

    // send the token as email

    const message = `Forgot password? Reset your new password at: ${resetUrl}.\n If you didn't forget your password, please ignore this message.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
            to: user.email,
        })

        res.status(200).json({
            status: 'success',
            message: 'Please check your email',
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        return next(
            new AppError(
                `There was an error sending the email. Try again later!`,
                500
            )
        )
    }
})

/**
 * Sign in the user whenever they come back.
 * Check for a JWT token
 */
const SignIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // Check if req contains an`email` and `password`
    if (!email || !password) {
        return next(new AppError(`Please provide an emaill and password.`, 400))
    }

    const user = await User.findOne({ email }).select('+password')

    // Verify if req `password` matches the user password.
    if (!user || !(await user.verifyPassword(password, user.password))) {
        return next(new AppError(`Incorrect email or password.`, 401))
    }

    const token = signToken({ id: user._id, name: user.name })

    res.status(200).json({
        status: 'success',
        message: 'You are authenticated',
        data: {
            token,
        },
    })
})

/**
 * Sign up the user for the first time.
 * Store it in the DB, return a JWT
 */
const SignUp = catchAsync(async (req, res, next) => {
    const { email, password, name, passwordConfirm } = req.body

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
    })

    const token = signToken({ id: user._id, name: user.name })

    res.status(200).json({
        status: 'success',
        message: 'Account created successfully',
        data: { user, token },
    })
})

const GetCurrentUser = catchAsync(async (req, res, next) => {
    const token = await verifyToken(req.headers.authorization.split(' ')[1])

    const user = await User.findById(token.id)

    res.status(200).json({
        status: 'success',
        data: user,
    })
})

module.exports = {
    SignIn,
    SignUp,
    ForgotPassword,
    ResetPassword,
    GetCurrentUser,
}
