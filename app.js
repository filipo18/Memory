const express = require("express");
const http = require("http");
const { workerData } = require("worker_threads");
const websocket = require("ws");

const Game = require("./game");

const port = process.argv[2];
const app = express();

const indexRouter = require("./routes/index");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const server = http.createServer(app);
const wss = new websocket.Server({ server });

app.get("/play", indexRouter);
app.get("/", indexRouter);

let connectionID = 0;
let gameID = 0;

let openGame = new Game(gameID++);

const webSockets = {}; // property: websocket, value: game

wss.on("connection", function connection(ws) {
    const con = ws;

    con["id"] = connectionID++;
    webSockets[con["id"]] = openGame;

    const playerType = openGame.addPlayer(con);

    // Ensure players of same game have same deck
    const sendDeck = {
        type: "DECK",
        data: openGame.deck,
        playerType: playerType, // Indicate which player the user is
    };
    con.send(JSON.stringify(sendDeck));

    if (openGame.hasTwoPlayers()) {
        console.log("Two players connected");

        const startMsg = {
            type: "START",
        };
        openGame.playerA.send(JSON.stringify(startMsg));
        openGame.playerB.send(JSON.stringify(startMsg));

        openGame = new Game(gameID++);
    }

    con.on("message", function incoming(data) {
        const msg = JSON.parse(data.toString());
        const currentGame = webSockets[con["id"]];

        console.log("Message received:");
        console.log(msg);

        if (msg.type === "GUESSED-ONE") {
            const otherPlayer =
                msg.from === "A" ? currentGame.playerB : currentGame.playerA;
            otherPlayer.send(
                JSON.stringify({
                    type: "GUESSED-ONE",
                    data: msg.data,
                })
            );
        }

        if (msg.type === "GUESSED-TWO") {
            // A complete (2 cards) guess was received

            const guess1 = msg.data[0].substring(1);
            const guess2 = msg.data[1].substring(1);

            let match = true;

            if (currentGame.deck[guess1] === currentGame.deck[guess2]) {
                // Correct guess
                console.log("Correct guess");
                match = true;
            } else {
                // Incorrect guess
                console.log("Incorrect guess");
                match = false;
            }

            const matchMsg = {
                type: "GUESSED-TWO",
                data: msg.data,
                from: msg.from,
                match: match,
            };

            currentGame.playerA.send(JSON.stringify(matchMsg));
            currentGame.playerB.send(JSON.stringify(matchMsg));
        }
    });

    con.on("close", function (code) {
        console.log(`User ${con["id"]} disconnected.`);

        const currentGame = webSockets[con["id"]];

        if (currentGame.gameState === "2 PLAYERS") {
            currentGame.gameState = "DONE";

            const winner = con === currentGame.playerA ? "B" : "A";

            const winnerSocket =
                winner === "A" ? currentGame.playerA : currentGame.playerB;

            const sendWinnerMsg = {
                type: "RESULT",
                data: winner,
            };

            winnerSocket.send(JSON.stringify(sendWinnerMsg));
        }
    });
});

server.listen(port);
