var Game = require('../models/game.model');

/**
 * Delete all games that are older than 24 hours.
 */
exports.deleteOldGames = function() {
    const today = new Date();
    const yesterday = today.setDate(date.getDate() - 1);
    Game.deleteMany({creationDate: {$lte: yesterday, $eq: null}}).exec((err) => {
        if (err) {
            console.err(err);
        }
    });
}