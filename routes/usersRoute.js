const { Router } = require('express')
const users = require('../services/users')

const UsersRouter = Router()

/**
 * ? GET / fetch all users route
 */
UsersRouter.route('/').get(users.GetAllUsers)

module.exports = UsersRouter
