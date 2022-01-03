const websocket = require("ws");
const deck = require("./public/javascripts/deck");

const Game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.guesses = {
        playerA: 0,
        playerB: 0,
    };
    this.points = {
        playerA: 0,
        playerB: 0,
    };
    this.gameState = "0 PLAYERS";
    this.deck = this.generateDeck();
    this.currentGuess = [];
};

Game.prototype.hasTwoPlayers = function () {
    return this.gameState === "2 PLAYERS";
};

Game.prototype.addPlayer = function (con) {
    if (this.gameState === "0 PLAYERS") {
        this.playerA = con;
        this.gameState = "1 PLAYERS";
        return "A";
    } else {
        this.playerB = con;
        this.gameState = "2 PLAYERS";
        return "B";
    }
};

Game.prototype.generateDeck = function () {
    const deck = [];

    deck.push("c0");
    deck.push("c1");
    deck.push("c2");
    deck.push("c3");
    deck.push("c4");
    deck.push("c5");
    deck.push("c6");
    deck.push("c7");

    deck.push("c0");
    deck.push("c1");
    deck.push("c2");
    deck.push("c3");
    deck.push("c4");
    deck.push("c5");
    deck.push("c6");
    deck.push("c7");

    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }

    return deck;
};

module.exports = Game;
