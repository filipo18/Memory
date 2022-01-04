const deckMap = {
    c0: "kim",
    c1: "putin",
    c2: "trump",
    c3: "stalin",
    c4: "merkel",
    c5: "boris",
    c6: "jonas",
    c7: "jinping",
};

function GameState(socket) {
    this.socket = socket;
    this.guess = [];
    this.playerType = null; // A or B
    this.myTurn = null;
    this.score = {
        myScore = 0,
        otherScore = 0,
    }
}

GameState.prototype.updateGame = function (clickedCard) {
    this.socket.send(
        JSON.stringify({
            type: "CLICKED-CARD",
            data: clickedCard.id,
        })
    );
};

GameState.prototype.updateScore = function (player) {
    const score = null;

    if (player === this.playerType) {
        score = document.querySelector(".opponentScore");
    } else {
        score = document.querySelector(".myScore");
    }

    score.innerHTML++;
}

GameState.prototype.updateMoves = function (player) {
    const moves = null;

    if (player === this.playerType) {
        moves = document.querySelector(".opponentMoves");
    } else {
        moves = document.querySelector(".myMoves");
    }

    moves.innerHTML++;
}

function CardBoard(gs) {
    this.cards = document.querySelectorAll(".card");

    this.initialize = function (deck) {
        Array.from(this.cards).forEach(function (el, index) {
            el.classList.add(deck[index]);
            el.addEventListener("click", function clicked(e) {
                if (gs.myTurn) {
                    el.classList.toggle("facedown");
                    el.classList.add("selected");
                    gs.guess.push(el.id);

                    const sendMsg = {
                        type: "GUESSED-ONE",
                        data: gs.guess,
                        from: gs.playerType,
                    };

                    if (gs.guess.length >= 2) {
                        // Max guesses reached
                        sendMsg.type = "GUESSED-TWO";
                        gs.myTurn = false;
                        gs.guess = [];
                    }

                    gs.socket.send(JSON.stringify(sendMsg));
                } else {
                    console.log("Not my turn.");
                }
            });
        });
    };

    this.eraseGuess = function () {
        Array.from(this.cards).forEach(function (el) {
            if (!el.classList.contains("matched")) {
                el.classList.add("facedown");
            }
            el.classList.remove("selected");
        });
    };

    this.reveal = function (cardID) {
        for (var i = 0; i < cardID.length; i++) {
            const card = document.getElementById(cardID[i]);
            card.classList.remove("facedown");
            card.classList.add("selected");
        }
    };

    this.match = function (cardID) {
        for (var i = 0; i < cardID.length; i++) {
            const card = document.getElementById(cardID[i]);
            card.classList.remove("facedown", "selected");
            card.classList.add("matched");
        }
    };
}

(function setup() {
    const socket = new WebSocket("ws://localhost:3000");

    const gs = new GameState(socket);

    const cb = new CardBoard(gs);

    socket.onmessage = function (event) {
        let msg = JSON.parse(event.data);
        console.log("Received message:");
        console.log(msg);

        if (msg.type === "DECK") {
            console.log("Received DECK");
            cb.initialize(msg.data);
            gs.playerType = msg.playerType;
            gs.myTurn = gs.playerType === "A" ? true : false;
        }

        if (msg.type === "GUESSED-ONE") {
            // Receive guess from other player
            cb.reveal(msg.data);
        }

        if (msg.type === "GUESSED-TWO") {
            // Receive guess from other player

            gs.updateMoves(msg.from);

            if (msg.match == true) {
                cb.match(msg.data);
                gs.updateScore(msg.from);
            } else {
                cb.reveal(msg.data);
            }

            setTimeout(function () {
                cb.eraseGuess();
                if (gs.playerType !== msg.from) {
                    gs.myTurn = true;
                }
            }, 3000);
        }

        if (msg.type === "START" && gs.myTurn == true) {
            cb.eraseGuess();
        }
    };
})();
