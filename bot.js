require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(port, () => {
  console.log(`Birbit listening on port ${port}`);
});

const Discord = require('discord.js');
const connectDB = require('./config/db');

const client = new Discord.Client();
const prefix = ']';

client.login(process.env.DISCORD_BOT_TOKEN);

connectDB();

client.on('ready', () => {
  console.log('Bot is ready!');
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    default:
      message.channel.send(`${command} command does not exist!`);
      return;
  }
});
