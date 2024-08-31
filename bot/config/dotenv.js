const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_LINK = process.env.WEB_LINK;

module.exports = {
    PORT,
    BOT_TOKEN,
    WEB_LINK
}