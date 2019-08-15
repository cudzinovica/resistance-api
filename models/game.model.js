const mongoose = require('mongoose')
const Schema = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate')
var LoyaltyEnum = require('../enums/loyalty.enum')

var Player = require('./player.model.js')

const GameSchema = Schema({
    phase: Number,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    currentLeaderIdx: Number,
    missionResults: [Boolean],
    failedVotes: Number,
    currentRound: Number,
    currentTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    winningTeam: Boolean
})

GameSchema.plugin(mongoosePaginate)
const Game = mongoose.model('Game', GameSchema)

module.exports = Game;