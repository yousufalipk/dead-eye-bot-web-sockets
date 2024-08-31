// Import required modules
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDb = require('./config/db');
const userRoutes = require('./Router/userRoutes');
const { PORT, FRONTEND_PATH } = require('./config/index');
const UserModel = require('./models/userModel');
const socketIo = require('socket.io');

const UserModel = require('./models/userModel');

const app = express();
const server = http.createServer(app);
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

    // Handle balance update requests
    socket.on('initializeUser', async (telegramId, firstName, lastName, username) => {
        try {
            const user = await UserModel.findOne({ telegramId });
            if (user) {
                socket.emit('userInitialized', { user: user });
            } else {
                const newUser = UserModel({
                    telegramId: telegramId,
                    firstName: firstName,
                    lastName: lastName,
                    username
                })
                await newUser.save();
                socket.emit('userInitialized', { user: newUser });
            }
        } catch (error) {
            socket.emit('error', { message: 'Error initializing user' });
        }
    });

    // Handle fetch initial balance
    socket.on('getInitialBalance', async (telegramId) => {
        try {
            const user = await UserModel.findOne({ telegramId });
            if (user) {
                socket.emit('initialBalance', { userId: user.id, balance: user.balance });
            } else {
                socket.emit('error', { message: 'User not found' });
            }
        } catch (error) {
            socket.emit('error', { message: 'Error fetching balance' });
        }
    });

    // Handle balance update requests
    socket.on('updateBalance', async (telegramId) => {
        try {
            const user = await UserModel.findOne({ telegramId });
            if (user) {
                user.balance += 1;  // Increment the balance by 1
                await user.save();

                socket.emit('balanceUpdated', { userId: user.id, newBalance: user.balance });
            } else {
                socket.emit('error', { message: 'User not found' });
            }
        } catch (error) {
            socket.emit('error', { message: 'Error updating balance' });
        }
    });
});


// Database Connection
connectDb();

// Routes
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Start express server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
