const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const AuthRouter = require('./routes/authRoute')
const UsersRouter = require('./routes/usersRoute')
const ProductRouter = require('./routes/productsRoute')
const AppError = require('./utils/appError')
const GlobalErrorHandler = require('./middlewares/globalError')

/**
 * Init Express App
 * Use json parser
 * Use cors
 * Set Access control headers on every req
 */
const App = express()
App.use(express.json())
App.use(cors())

// Add logger in development
if (process.NODE_ENV !== 'production') {
    App.use(morgan('dev'))
}

App.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
})

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
