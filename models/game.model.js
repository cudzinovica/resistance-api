const mongoose = require('mongoose')
const Schema = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate')

var Player = require('./player.model.js')

const GameSchema = Schema({
    phase: Number,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    currentLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    missionResults: [Boolean],
    failedVotes: Number,
    currentRound: Number
})

GameSchema.plugin(mongoosePaginate)
const Game = mongoose.model('Game', GameSchema)

module.exports = Game;