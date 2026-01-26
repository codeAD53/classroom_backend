"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app = (0, express_1.default)();
var PORT = 4000;
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('Hello! Welcome to classroom ');
});
app.listen(PORT, function () { return console.log("Server running on http://localhost:".concat(PORT)); });
