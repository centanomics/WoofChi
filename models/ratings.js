const mongoose = require('mongoose');

const RatingsSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  ratedUserId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('ratings', RatingsSchema);
