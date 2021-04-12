const { MessageEmbed } = require('discord.js');
// @command     help
// @desc        gets commands
// @access      all
module.exports = {
  name: 'help',
  description: 'gets commands',
  delay: 5000,
  mod: false,
  execute: (message, args) => {
    const embed = new MessageEmbed();
    embed.title = 'Commands';
    embed.addField(']rate <@user> <rating>', 'Rate a user between 1 and 5');
    embed.addField(']rate <@user>', "Shows a user's rating");
    embed.addField(']top', 'Top 5');

    message.channel.send({ embed: embed });
  },
};
