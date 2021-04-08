const avgRating = {
  avg: (ratings) => {
    const numRatings = [];

    ratings.map((rating) => {
      numRatings.push(rating.rating);
    });
    const avg = numRatings.reduce((x, y) => x + y) / ratings.length;
    return +avg.toFixed(2);
  },
};

module.exports = avgRating;
