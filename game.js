const websocket = require("ws");

const game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.wordToGuess = null; //first player to join the game, can set the word
    this.gameState = "0 PLAYERS"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
};

module.exports = game;
