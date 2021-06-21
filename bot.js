require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = 4000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

//discord bot

const Discord = require('discord.js');
const connectDB = require('./config/db');

const rate = require('./commands/rate');
const help = require('./commands/help');
const top = require('./commands/top');
const boards = require('./commands/boards');

const intents = [
  'GUILDS',
  'GUILD_MEMBERS',
  'GUILD_BANS',
  'GUILD_INVITES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS',
];

// const client = new Discord.Client({
//   intents: intents,
//   ws: { intents: intents },
// });
const client = new Discord.Client();
const prefix = ']';

client.login(process.env.DISCORD_BOT_TOKEN);

connectDB();

client.on('ready', () => {
  console.log('Woofchi is ready!');
  client.user.setPresence({
    status: 'online', //You can show online, idle....
    activity: {
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
    case 'boards':
      boards.execute(message, args);
      return;
    default:
      message.channel.send(`${command} command does not exist!`);
      return;
  }
});

// api routes

const guildsRouter = require('./routes/guilds')(client);

app.use('/api/guilds', guildsRouter);

app.listen(port, () => {
  console.log(`Birbit listening on port ${port}`);
});
