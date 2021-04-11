const Ratings = require('../models/ratings');
const avgRating = require('../utils/avgRating');
const { MessageEmbed } = require('discord.js');

// @command     top
// @desc        gets top 5
// @access      all
module.exports = {
  name: 'top',
  description: 'gets top 5',
  delay: 5000,
  mod: false,
  execute: async (message, args) => {
    try {
      const allRatedUsers = await Ratings.distinct('ratedUserId', {
        guildId: message.guild.id,
      });
      const allRatings = await Ratings.find(
        { guildId: message.guild.id },
        'rating ratedUserId'
      );

      const userRatings = [];

      for (let i = 0; i < allRatedUsers.length; i++) {
        userRatings.push({ user: allRatedUsers[i], ratings: [], avg: null });
        for (let j = 0; j < allRatings.length; j++) {
          if (allRatings[j].ratedUserId === allRatedUsers[i]) {
            userRatings[i].ratings.push(allRatings[j].rating);
          }
        }
      }

      for (let i = 0; i < userRatings.length; i++) {
        userRatings[i].avg = avgRating.avgNum(userRatings[i].ratings);
      }

      userRatings.sort((a, b) => a.avg + b.avg);
      console.log(userRatings);

      const embed = new MessageEmbed();
      embed.title = 'Top 5 Rated Users';

      for (let i = 0; i < 5; i++) {
        if (userRatings[i] === undefined) {
          break;
        }
        // console.log(userRatings[i]);
        const targetUser = await message.guild.members.fetch(
          userRatings[i].user
        );
        embed.addField(
          `${i + 1} ${targetUser.nickname}`,
          `Rating: ${userRatings[i].avg}`
        );
      }
      message.channel.send({ embed: embed });
    } catch (err) {
      console.log(err.message);
      message.channel.send(err.message);
    }
  },
};
