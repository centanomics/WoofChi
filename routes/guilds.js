const router = require('express').Router();
let discClient;

router.get('/:guildId', async (req, res) => {
  let guild = await discClient.guilds.fetch(req.params.guildId);
  res.json({ guildName: guild.name });
});

module.exports = (client) => {
  discClient = client;
  return router;
};
