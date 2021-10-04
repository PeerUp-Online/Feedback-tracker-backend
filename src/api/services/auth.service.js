const crypto = require('crypto')
const catchAsync = require('../helpers/catchAsync')
const AppError = require('../helpers/appError')
const User = require('../models/user.model')
const signToken = require('../helpers/signToken')
const sendEmail = require('../helpers/email')
const verifyToken = require('../helpers/verifyToken')

const updatePassword = async (token, passwordConfirm, password) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
        passwordResetToken: hashedToken,
    })

    if (!user) {
        throw new AppError(`Token is invalid or has expired`, 400)
    }

    user.password = password
    user.passwordConfirm = passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()

    const signedToken = signToken({ id: user._id, name: user.name })

    return signedToken
}

const sendResetToken = async (baseUrl, email) => {
    // Get user
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(
            `There is no user with the given email address.`,
            404
        )
    }

    // Generate a random token
    const resetToken = user.createResetToken()

    await user.save({ validateBeforeSave: false })

    const resetUrl = baseUrl + resetToken

    // send the token as email

    const message = `Forgot password? Reset your new password at: ${resetUrl}.\n If you didn't forget your password, please ignore this message.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
            to: user.email,
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        throw new AppError(
            `There was an error sending the email. Try again later!`,
            500
        )
    }
}

const signIn = async (email, password) => {
    const user = await User.findOne({ email }).select('+password')

    // Verify if req `password` matches the user password.
    if (!user || !(await user.verifyPassword(password, user.password))) {
        throw new AppError(`Incorrect email or password.`, 401)
    }

    const token = signToken({ id: user._id, name: user.name })

    return token
}

const signUp = async (data) => {
    const { email, password, name, passwordConfirm } = data

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
    })

    const token = signToken({ id: user._id, name: user.name })

    return { user, token }
}

const getCurrentUser = async (userToken) => {
    const token = await verifyToken(userToken)
    console.log('token: ', token);

    const user = await User.findById(token.id)

    return user
}

module.exports = {
    signIn,
    signUp,
    sendResetToken,
    updatePassword,
    getCurrentUser,
}
