var express = require("express");
var router = express.Router();
var deck = require("../public/javascripts/deck");

router.get("/play", function (req, res) {
    res.render("game.ejs", { deck: deck });
});

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("splash.ejs");
});

module.exports = router;
