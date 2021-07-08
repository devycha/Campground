const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan("tiny"));

app.get("/", (req, res) => {
    res.render("home page");
});

app.get("/dogs", (req, res) => {
    res.render("woof page");
});

app.listen(3000, () => {
    console.log("on port 3000");
});