const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

module.exports = (App) => {
    /**
     * Init Express App
     * Use json parser
     * Use cors
     * Set Access control headers on every req
     */
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
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PATCH, DELETE'
        )
        next()
    })

    return App
}
