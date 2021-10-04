const express = require('express')
const AuthRouter = require('./routes/auth.routes')
const UsersRouter = require('./routes/user.routes')
const ProductRouter = require('./routes/product.routes')
const AppError = require('./helpers/appError')
const GlobalErrorHandler = require('./middlewares/error.middleware')
const App = require('./helpers/loaders/express.loader')(express())




/**
 * Users API ROUTER: PUBLIC
 */
App.use('/api/v1/auth', AuthRouter)

/**
 * Users API ROUTER: PUBLIC
 */
App.use('/api/v1/users', UsersRouter)

/**
 * Products API ROUTER: Requires Authorization
 */
App.use('/api/v1/products', ProductRouter)

/**
 * Capture unhandled Routes
 */
App.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404))
})

App.use(GlobalErrorHandler)

module.exports = App
