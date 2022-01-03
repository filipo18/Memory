function GameState(socket) {
    this.socket = socket;
}

GameState.prototype.shuffleCards = function () {
    const cards = document.querySelectorAll(".card");

    Array.from(cards).forEach(function (el) {
        el.addEventListener("click", function clicked(e) {
            console.log("Clicked button ID:", e.target["id"]);
            el.classList.toggle("facedown");
            const stringToSend = "Testing connection. ID: " + el.id;
            // TODO generates error
            this.socket.send(stringToSend);
        });
    });
};

(function setup() {
    const socket = new WebSocket("ws://localhost:3000");

    const gs = new GameState(socket);

    socket.onmessage = function (event) {
        console.log("Got a message:");
        console.log(event.data.toString());
    };

    socket.onopen = function () {
        console.log("Opening websocket connection");
        socket.send("Opening connection!");
        gs.shuffleCards();
    };
})();
