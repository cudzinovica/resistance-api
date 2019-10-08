var mongoose = require('mongoose')

var PlayerSchema = new mongoose.Schema({
    name: String,
    loyalty: Boolean,
    character: Number,
    currentVote: Boolean,
    hasVoted: Boolean,
    currentQuest: Boolean,
    hasQuested: Boolean
})

module.exports = PlayerSchema;