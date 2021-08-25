const router = require('express').Router();

const Ratings = require('../models/ratings');
const avgRating = require('../utils/avgRating');

let discClient;

// gets basic guild info for home pag
router.get('/guildName/:guildId', async (req, res) => {
  let guild = await discClient.guilds.fetch(req.params.guildId);
  res.send(guild.name);
});

// gets all ratings for a specific guild (and relevant info for display)
router.get('/ratings/:guildId', async (req, res) => {
  let guild = await discClient.guilds.fetch(req.params.guildId);
  try {
    const allRatedUsers = await Ratings.distinct('ratedUserId', {
      guildId: req.params.guildId,
    });
    const allRatings = await Ratings.find(
      { guildId: req.params.guildId },
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

    //adds relevant info to each userRatings object
    for (let i = 0; i < userRatings.length; i++) {
      const targetUser = await guild.members.fetch(userRatings[i].user);

      userRatings[i].avg = avgRating.avgNum(userRatings[i].ratings);
      userRatings[i].name = targetUser.nickname || targetUser.user.username;
      userRatings[i].avatar = targetUser.user.avatarURL({
        format: 'png',
        dynamic: true,
        size: 128,
      });
    }
    userRatings.sort((a, b) => (a.avg > b.avg ? -1 : 1));

    res.send(userRatings);
  } catch (err) {
    console.log(err.message);
  }
});

// grabs client from the botjs file
module.exports = (client) => {
  discClient = client;
  return router;
};
