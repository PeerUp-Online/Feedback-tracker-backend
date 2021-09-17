const { Router } = require('express')
const checkAuth = require('../middlewares/checkAuth')
const auth = require('../services/auth')

const AuthRouter = Router()

/**
 * ? POST / Signin or Login route
 */
AuthRouter.route('/signin').post(auth.SignIn)

/**
 * ? POST / Signup or Register route
 */
AuthRouter.route('/signup').post(auth.SignUp)

/**
 * ? POST / Forgot Password route
 */
AuthRouter.route('/forgotpassword').post(auth.ForgotPassword)

/**
 * ? POST / Reset Password route
 */
AuthRouter.route('/resetpassword/:token').patch(auth.ResetPassword)

AuthRouter.use(checkAuth)

AuthRouter.route('/me').get(auth.GetCurrentUser)

module.exports = AuthRouter
