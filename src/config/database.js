const mongoose = require('mongoose')

module.exports = () => {
    if (process.env.NODE_ENV !== 'production') {
        // Turn on mongoose logging in development
        mongoose.set('debug', true)
    }

    // Connect to Prod DB using Production creds
    mongoose
        .connect(process.env.DB_URL)
        .then((db) =>
            console.log(`DB Connection Success to: ${db.connection.name}`)
        )
        .catch((err) => console.log(err.message))
}
