const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_PATH = process.env.FRONTEND_PATH

module.exports = {
    PORT,
    MONGODB_URI,
    FRONTEND_PATH
}