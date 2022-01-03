const kim = {
    type: "kim",
    img: "../images/kim.jpeg",
};

const putin = {
    type: "putin",
    img: "../images/putin.jpeg",
};

const trump = {
    type: "trump",
    img: "../images/trump.jpeg",
};

const stalin = {
    type: "stalin",
    img: "../images/stalin.jpeg",
};

const merkel = {
    type: "merkel",
    img: "../images/merkel.jpeg",
};

const boris = {
    type: "boris",
    img: "../images/boris.jpeg",
};

const jonas = {
    type: "jonas",
    img: "../images/jonas.jpeg",
};

const jinping = {
    type: "jinping",
    img: "../images/jinping.jpeg",
};

const deckMap = {
    c0: kim,
    c1: putin,
    c2: trump,
    c3: stalin,
    c4: merkel,
    c5: boris,
    c6: jonas,
    c7: jinping,
};

function GameState(socket) {
    this.socket = socket;
}
/*
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
*/

GameState.prototype.updateGame = function (clickedCard) {};

function setCards(cards) {
    const grid = document.querySelector(".grid");

    for (var i = 0; i < 16; i++) {
        const newCell = document.createElement("div");
        const type = deckMap[cards[i]].type;
        newCell.classList.add("card", "facedown", type);
        newCell.id = cards[i];
        newCell.addEventListener("click", clickCard);
        grid.appendChild(newCell);
    }
}

function clickCard(e) {
    this.classList.toggle("facedown");
    //socket.send(JSON.stringify());
}

function cardMatch(c1, c2) {
    return deckMap[c1.id].type === deckMap[c2.id].type;
}

(function setup() {
    const socket = new WebSocket("ws://localhost:3000");

    const gs = new GameState(socket);

    let btn = document.getElementById("btn");

    btn.addEventListener("click", function (e) {
        socket.send(e);
    });

    socket.onmessage = function (event) {
        console.log("Got a message:");
        // console.log(event.data.toString());

        const { data } = event;
        const obj = JSON.parse(data);

        if (obj.deck !== "undefined") {
            console.log(obj);
            setCards(obj["deck"]);
        }
    };
})();
