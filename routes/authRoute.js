const { Router } = require('express')
const {
    ResetPasswordController,
    SignInController,
    SignUpController,
} = require('../controllers/auth')

const AuthRouter = Router()

/**
 * ? POST / Signin route
 */
AuthRouter.route('/').post(SignInController)
/**
 * ? POST / Signup route
 */
AuthRouter.route('/signup').post(SignUpController)
/**
 * ? POST / Reset Password route
 */
AuthRouter.route('/reset').post(ResetPasswordController)

module.exports = AuthRouter
