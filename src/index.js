/**
 * Crash the app on any Uncaught exceptions inside the app
 * This should fire before any buggy code executes.
 */
process.on('uncaughtException', (err) => {
    console.error(
        chalk.redBright(
            `Uncaught exception: ${err.name} ${err.message}, ${err.stack} , shutting down...`
        )
    )
    process.exit(1)
})
const http = require('http')
const chalk = require('chalk')
const dotEnv = require('dotenv')
const path = require('path')
const connectDB = require('./config/database')

dotEnv.config({ path: path.join(__dirname, './config/.env') })

connectDB()

const App = require('./api/app')

const PORT = process.env.PORT || 3000

const server = http.createServer(App)

server.listen(PORT, () =>
    console.log(chalk.greenBright(`Server listening at Port ${PORT}...`))
)
    
/**
 * Last safety net for any unhandled rejections inside the app
 */
process.on('unhandledRejection', (err) => {
    console.error(
        chalk.redBright(
            `Unhandled Rejection: ${err.name} ${err.message} , shutting down...`
        )
    )
    server.close(() => {
        process.exit(1)
    })
})
