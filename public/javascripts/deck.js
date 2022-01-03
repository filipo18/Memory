const deck = [];

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

deck.push(kim);
deck.push(putin);
deck.push(trump);
deck.push(stalin);
deck.push(merkel);
deck.push(boris);
deck.push(jonas);
deck.push(jinping);

deck.push(kim);
deck.push(putin);
deck.push(trump);
deck.push(stalin);
deck.push(merkel);
deck.push(boris);
deck.push(jonas);
deck.push(jinping);

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

shuffleArray(deck);

module.exports = deck;
