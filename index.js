const dotEnv = require('dotenv')
const App = require('./app')

dotEnv.config({ path: './config.env' })

const PORT = process.env.PORT || 3000

// eslint-disable-next-line no-console
App.listen(PORT, () => console.log(`Server listening at Port ${PORT}...`))
