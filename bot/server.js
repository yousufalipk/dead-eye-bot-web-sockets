const { Telegraf } = require('telegraf');
const express = require('express');
const { PORT, BOT_TOKEN, WEB_LINK } = require('./config/dotenv');
const community_link = "https://t.me/yousufbhatti_1";

const app = express();

app.use(express.json());

// Initialize the Telegram bot using the bot token
const bot = new Telegraf(BOT_TOKEN);

// Simple message handler for the bot
bot.on('message', async (ctx) => {
    try {
        await ctx.reply(`Hey, Welcome to Dead_Eye_Bot!`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "👋 Start now!", web_app: { url: WEB_LINK } }],
                    [{ text: "Join our Community", url: community_link }],
                ],
            },
        });
    } catch (err) {
        console.error('Error handling message:', err);
    }
});

// Error handling for Telegraf
bot.catch((err, ctx) => {
    console.error(`Encountered an error for ${ctx.updateType}`, err);
});

app.listen(PORT, () => {
    console.log(`Bot is running on port: ${PORT}`);
    
    bot.launch()
        .then(() => console.log('Telegram bot is running'))
        .catch((err) => console.error('Failed to launch bot:', err));
});

app.get('/', (req, res) => {
    res.send("Bot running successfully!");
});
