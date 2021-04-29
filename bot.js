require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// api routes

app.get('/json', (req, res) => {
  res.json({ message: 'hi' });
});

app.listen(port, () => {
  console.log(`Birbit listening on port ${port}`);
});

//discord bot

const Discord = require('discord.js');
const connectDB = require('./config/db');

const rate = require('./commands/rate');
const help = require('./commands/help');
const top = require('./commands/top');

const client = new Discord.Client();
const prefix = ']';

client.login(process.env.DISCORD_BOT_TOKEN);

connectDB();

client.on('ready', () => {
  console.log('Woofchi is ready!');
  client.user.setPresence({
    status: 'online', //You can show online, idle....
    game: {
      name: ']help', //The message shown
      type: 'PLAYING', //PLAYING: WATCHING: LISTENING: STREAMING:
    },
  });
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'rate':
      rate.execute(message, args);
      return;
    case 'help':
      help.execute(message, args);
      return;
    case 'top':
      top.execute(message, args);
      return;
    default:
      message.channel.send(`${command} command does not exist!`);
      return;
  }
});
