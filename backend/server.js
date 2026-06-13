const express = require('express');
const app = express();
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoute');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoute');
const userRoutes = require('./routes/userRoute');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const socketSetup = require('./socket/socket');

require('dotenv').config(); // ✅ IMPORTANT (deployment fix)

connectDB();

const server = http.createServer(app);

// socket
socketSetup(server);

const allowedOrigins = [
  "http://localhost:3000",
  "https://chatz-keep.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));





app.use(cookieParser());
app.use(express.json());


// Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);
app.use('/user', userRoutes);


app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});