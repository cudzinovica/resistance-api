var GameService = require('../services/games.service');

_this = this


exports.getGames = async function(req, res, next){
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;

    try{
        const [statusCode, response] = await GameService.getGames({}, page, limit)
        return res.status(statusCode).json(response);
    }catch(e){
        return res.status(500).json(e.message);
    }
}

exports.getGame = async function(req, res, next){
    var id = req.params.id;

    try{
        const [statusCode, response] = await GameService.getGame(id)
        return res.status(statusCode).json(response);
    }catch(e){
        return res.status(500).json(e.message);
    }
}

exports.createGame = async function(req, res, next){

    try{
        const [statusCode, response] = await GameService.createGame()
        return res.status(statusCode).json(response)
    }catch(e){
        return res.status(500).json(e.message)
    }
}

exports.updateGame = async function(req, res, next){
    let game = req.body;
    let id = req.params.id;

    try{
        const [statusCode, response] = await GameService.updateGame(id, game)
        return res.status(statusCode).json(response)
    }catch(e){
        return res.status(500).json(e.message)
    }
}

exports.removeGame = async function(req, res, next){
    var id = req.params.id;

    try{
        let [statusCode, response] = await GameService.deleteGame(id);
        if (response) {
            return res.status(statusCode).json(response);
        } else {
            return res.status(statusCode).json();
        }
    }catch(e){
        return res.status(500).json("Error Occured while Deleting the Game: " + e.message);
    }

}
