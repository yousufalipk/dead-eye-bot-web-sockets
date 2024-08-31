const express = require('express');

const router = express.Router();

const { 
    fetchUserData
} = require('../Controller/userController');


router.post('/fetch-user-data', fetchUserData);

module.exports = router;