const express = require('express')
const http = require('http')
const morgan = require('morgan')
const cors = require('cors')

const UserController = require('./src/controllers/user.controller.js')
const Auth = require('./src/auth/auth')
const UserRoutes = require('./src/routes/users.routes.js');

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => { res.send('Server is up and running') })
app.post('/signup', UserController.createUser)
app.post('/login', UserController.verifyUser)
app.post('/token', Auth.generateAccessTokenWithRefreshToken)

app.use('/users', UserRoutes)

const server = http.createServer(app)
const PORT = 5000

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
