const chalk = require('chalk')
const dotEnv = require('dotenv')
const mongoose = require('mongoose')
dotEnv.config({ path: './config.env' })

/**
 * Crash the app on any Uncaught exceptions inside the app
 * This should fire before any buggy code executes.
 */
process.on('uncaughtException', err => {
    console.error(
        chalk.redBright(
            `Uncaught exception: ${err.name} ${err.message} , shutting down...`
        )
    )
    process.exit(1)
})


if (process.env.NODE_ENV !== 'production') {
    // Turn on mongoose logging in development
    mongoose.set('debug', true)

    // Connect to Dev DB using Development creds
    mongoose
        .connect(process.env.DB_DEVELOPMENT_URL, { autoIndex: true })
        .then(db => {
            console.log(
                chalk.cyanBright(
                    `DB Connection Success to: ${db.connection.name}`
                )
            )
        })
} else {
    // Connect to Prod DB using Production creds
    mongoose
        .connect(process.env.DB_PRODUCTION_URL, { autoIndex: false })
        .then(db => {
            console.log(
                chalk.cyanBright(
                    `DB Connection Success to: ${db.connection.name}`
                )
            )
        })
}

const App = require('./app')

const PORT = process.env.PORT || 3000

const server = App.listen(PORT, () =>
    console.log(chalk.greenBright(`Server listening at Port ${PORT}...`))
)

/**
 * Last safety net for any unhandled rejections inside the app
 */
process.on('unhandledRejection', err => {
    console.error(
        chalk.redBright(
            `Unhandled Rejection: ${err.name} ${err.message} , shutting down...`
        )
    )
    server.close(() => {
        process.exit(1)
    })
})
