const express = require('express')
const app = express()
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoute')
const chatRoutes = require('./routes/chatRoutes')
const messageRotes = require('./routes/messageRroute')
const userRoutes = require('./routes/userRoute')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const socketSetup = require('./socket/socket')


connectDB()

// socket
const server = http.createServer(app)
socketSetup(server)


app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}))

app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/chat',chatRoutes)
app.use('/message',messageRotes)
app.use('/user',userRoutes)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`)
})