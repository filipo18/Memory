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

wss.on("connection", function connection(ws) {
    const con = ws;

    con["id"] = connectionID++;

    // if (openGame.hasTwoPlayers()) {
    //     openGame = new Game(gameID++);
    // }

    const playerType = openGame.addPlayer(con);

    con.send("Connection ID: " + (connectionID - 1));

    //con.send(openGame.deck.toString());

    const sendDeck = {
        deck: openGame.deck,
    };
    con.send(JSON.stringify(sendDeck));
    console.log(JSON.stringify(sendDeck));

    con.on("message", function incoming(data) {
        // console.log("received: %s", data);

        const msg = {};

        try {
            msg = JSON.parse(data.toString());
        } catch (e) {
            console.log("Couldnt parse JSON. Message:");
            console.log(data.toString());
        }
    });

    con.on("close", function (code) {
        console.log(`User ${con["id"]} disconnected.`);
    });
});

server.listen(port);
