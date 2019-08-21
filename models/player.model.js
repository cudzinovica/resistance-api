var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var PlayerSchema = new mongoose.Schema({
    name: String,
    loyalty: Boolean,
    character: Number,
    currentVote: Boolean,
    hasVoted: Boolean,
    currentQuest: Boolean,
    hasQuested: Boolean
})

PlayerSchema.plugin(mongoosePaginate)
const Player = mongoose.model('Player', PlayerSchema)

module.exports = Player;