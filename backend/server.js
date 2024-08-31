// Import required modules
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDb = require('./config/db');
const { PORT, FRONTEND_PATH } = require('./config/index');
const UserModel = require('./models/userModel');
const socketIo = require('socket.io');

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Initialize socket.io with CORS settings
const io = socketIo(server, {
    cors: {
        origin: FRONTEND_PATH,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

console.log("Port", PORT);

// Middleware
app.use(express.json());
app.use(cors({
    origin: FRONTEND_PATH,
    methods: ["GET", "POST"],
    credentials: true
}));

// WebSockets setup
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle user initialization
    socket.on('initializeUser', async (telegramId, firstName, lastName, username) => {
        try {
            let user = await UserModel.findOne({ telegramId });
            if (!user) {
                user = new UserModel({
                    telegramId,
                    firstName,
                    lastName,
                    username,
                    balance: 0,
                });
                await user.save();
            }
            // Send initialized user data back to the client
            socket.emit('userInitialized', { user });
        } catch (error) {
            console.error('Error initializing user:', error);
            socket.emit('error', { message: 'Error initializing user' });
        }
    });

    // Handle balance update requests
    socket.on('updateBalance', async (telegramId, addCoins) => {
        try {
            const user = await UserModel.findOne({ telegramId });
            if (user) {
                user.balance += addCoins; // Increment the value from frontend
                await user.save();

                // Notify the client who updated the balance
                socket.emit('balanceUpdated', { user });

                // Optionally, notify all clients about the updated balance
                io.emit('balanceUpdated', { user });
            } else {
                socket.emit('error', { message: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating balance:', error);
            socket.emit('error', { message: 'Error updating balance' });
        }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Database Connection
connectDb();

// Default route
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Start express server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
