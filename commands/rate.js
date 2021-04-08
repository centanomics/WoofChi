const Ratings = require('../models/ratings');
const uuid = require('uuid');
const avgRating = require('../utils/avgRating');

const ratedRecently = new Set();

// @command     rate
// @desc        rate a user
// @access      all
module.exports = {
  name: 'rate',
  description: 'rates a user',
  delay: 5000,
  mod: false,
  execute: async (message, args) => {
    try {
      let [ratedUser, rating] = args;
      rating = parseFloat(rating);
      ratedUser = message.mentions.users.first().id;

      if (args.length < 2) {
        const targetRatings = await Ratings.find(
          {
            guildId: message.guild.id,
            ratedUserId: ratedUser,
          },
          'rating'
        );
        if (targetRatings.length === 0) {
          throw { message: 'No one has rated you yet. Sad!' };
        }

        const avgRatings = avgRating.avg(targetRatings);
        const targetUser = await message.guild.members.fetch(ratedUser);
        message.channel.send(
          `${
            message.author.id === ratedUser
              ? 'You are'
              : targetUser.nickname + ' is'
          } rated at ${avgRatings} stars`
        );
        return;
      }

      if (rating < 1 || rating > 5) {
        throw { message: 'You must rate someone between 1 and 5.' };
      }

      if (message.author.id === ratedUser) {
        throw { message: 'You canot rate yourself.' };
      }

      if (ratedRecently.has(message.author.id + ratedUser)) {
        message.channel.send(
          'You cannot use that user just yet! Wait 1 minute.'
        );
        return;
      } else {
        ratedRecently.add(message.author.id + ratedUser);
        setTimeout(() => {
          ratedRecently.delete(message.author.id + ratedUser);
        }, 60000);
      }

      const newRating = new Ratings({
        _id: uuid.v4(),
        rating: rating,
        userId: message.author.id,
        guildId: message.guild.id,
        ratedUserId: ratedUser,
      });

      const upRating = await newRating.save();

      const targetRatings = await Ratings.find(
        {
          guildId: message.guild.id,
          ratedUserId: ratedUser,
        },
        'rating'
      );

      const avgRatings = avgRating.avg(targetRatings);
      // console.log(targetRatings);
      // const avgRating = targetRatings.reduce((x, y) => {
      //   console.log(x.rating);
      //   return x.rating + y.rating;
      // });

      // console.log(avgRating);

      const targetUser = await message.guild.members.fetch(ratedUser);
      message.channel.send(
        `${targetUser.nickname} is now rated ${avgRatings} stars`
      );
    } catch (err) {
      console.log(err.message);
      message.channel.send(err.message);
    }
  },
};
