const express = require("express");
const http = require("http");
const { workerData } = require("worker_threads");
const websocket = require("ws");

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

wss.on("connection", function connection(ws) {
    const con = ws;

    con["id"] = connectionID++;

    con.on("message", function message(data) {
        console.log("received: %s", data);
    });

    con.send("Testing");
});

server.listen(port);
