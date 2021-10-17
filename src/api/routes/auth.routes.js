const { Router } = require('express')
const checkAuth = require('../middlewares/auth.middleware')
const controller = require('../controllers/auth.controller')

const AuthRouter = Router()

/**
 * ? POST / Signin or Login route
 */
AuthRouter.route('/signin').post(controller.SignIn)

/**
 * ? POST / Signup or Register route
 */
AuthRouter.route('/signup').post(controller.SignUp)

/**
 * ? POST / Forgot Password route
 */
AuthRouter.route('/forgotpassword').post(controller.ForgotPassword)

/**
 * ? POST / Reset Password route
 */
AuthRouter.route('/resetpassword/:token').patch(controller.ResetPassword)

AuthRouter.use(checkAuth)

AuthRouter.route('/signout').delete(controller.SignOut)

module.exports = AuthRouter
