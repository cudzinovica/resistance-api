const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var PlayerSchema = require('./player.schema');

const GameSchema = Schema({
    phase: Number,
    players: [PlayerSchema],
    currentLeaderIdx: Number,
    missionResults: [{type: Boolean}],
    failedVotes: Number,
    currentRound: Number,
    currentTeam: [PlayerSchema],
    winningTeam: Boolean
});

GameSchema.plugin(mongoosePaginate);
const Game = mongoose.model('Game', GameSchema);

module.exports = Game;