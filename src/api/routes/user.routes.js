const { Router } = require('express')
const checkAuth = require('../middlewares/auth.middleware')
const { getCurrentUser } = require('../controllers/user.controller')

const UsersRouter = Router()

// Check for auth headers
UsersRouter.use(checkAuth)

/**
 * ? GET / fetch all users route
 */

UsersRouter.route('/me').get(getCurrentUser)

module.exports = UsersRouter
