const chalk = require('chalk')
const dotEnv = require('dotenv')
const mongoose = require('mongoose')

dotEnv.config({ path: '.env' })

/**
 * Crash the app on any Uncaught exceptions inside the app
 * This should fire before any buggy code executes.
 */
process.on('uncaughtException', err => {
    console.error(
        chalk.redBright(
            `Uncaught exception: ${err.name} ${err.message}, ${err.stack} , shutting down...`
        )
    )
    process.exit(1)
})

if (process.env.NODE_ENV !== 'production') {
    // Turn on mongoose logging in development
    mongoose.set('debug', true)
}
// Connect to Prod DB using Production creds
mongoose
    .connect(process.env.DB_URL, {
        autoIndex: process.env.NODE_ENV !== 'production',
    })
    .then(db => {
        console.log(
            chalk.cyanBright(`DB Connection Success to: ${db.connection.name}`)
        )
    })

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
