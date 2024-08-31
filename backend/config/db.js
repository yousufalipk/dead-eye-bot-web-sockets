const mongoose = require('mongoose');
const { MONGODB_URI } = require('./index');

const connectDb = () => {
    try{
        mongoose.connect(MONGODB_URI);
        console.log("Database Connection Successful!");
    }catch(error){
        console.log("Database Connection failed!", error);
    }
};

module.exports = connectDb;