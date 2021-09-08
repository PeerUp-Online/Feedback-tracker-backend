const { Router } = require('express')
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
 * ? POST / Reset Password route
 */
AuthRouter.route('/reset').post(auth.ResetPassword)

module.exports = AuthRouter
