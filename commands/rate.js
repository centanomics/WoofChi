// @command     rate
// @desc        rate a user
// @access      all
module.exports = {
  name: 'rate',
  description: 'rates a user',
  delay: 5000,
  mod: false,
  execute: (message, args) => {
    message.channel.send('rate');
  },
};
