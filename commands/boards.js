// @command     boards
// @desc        gets commands
// @access      all
module.exports = {
  name: 'boards',
  description: 'links stats site',
  delay: 5000,
  mod: false,
  execute: (message, args) => {
    message.channel.send(
      `See stats here: http://localhost:3000/guild?g=${message.guild.id}`
    );
  },
};
