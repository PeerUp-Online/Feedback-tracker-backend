const service = require('../services/auth.service')
const catchAsync = require('../helpers/catchAsync')

const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
}

const ResetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params
    const { password, passwordConfirm } = req.body

    const signedToken = await service.updatePassword(
        token,
        passwordConfirm,
        password
    )

    res.status(200).json({
        status: 'success',
        token: signedToken,
    })
})

const ForgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body

    const baseUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/auth/resetPassword/`

    await service.sendResetToken(baseUrl, email)

    res.status(200).json({
        status: 'success',
        message: 'Please check your email',
    })
})

/**
 * Sign in the user whenever they come back.
 * Check for a JWT token
 */
const SignIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    const { token, user } = await service.signIn(email, password)

    res.status(200).json({
        status: 'success',
        message: 'You are authenticated',
        result: {
            token,
            user,
        },
    })
})

/**
 * Sign up the user for the first time.
 * Store it in the DB, return a JWT
 */
const SignUp = catchAsync(async (req, res, next) => {
    const { email, password, name, passwordConfirm } = req.body

    const { user, token } = await service.signUp({
        email,
        password,
        name,
        passwordConfirm,
    })

    res.status(200).json({
        status: 'success',
        message: 'Account created successfully',
        result: { user, token },
    })
})

module.exports = {
    SignIn,
    SignUp,
    ForgotPassword,
    ResetPassword,
}
