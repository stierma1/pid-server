var express = require("express");
var bodyParser = require("body-parser");
var Register = require("./register");

var register = new Register();
module.exports = function(config) {

    var app = express();

    app.get("/classes/:className", function(req, res) {
        register.getInfosByClass(req.params.className).then(function(doc) {
            res.status(200).json(doc);
        });
    });

    app.get("/pids", function(req, res) {
        register.getInfos().then(function(docs) {
            res.status(200).json(docs);
        });

    })

    app.get("/pids/:pidName", function(req, res) {
        register.getInfo(req.params.id).then(function(doc) {
            res.status(200).json(doc);
        });
    });

    app.get("/pids/heartbeat/:id", function(req, res) {
        register.heartbeatReceived(req.params.id).then(function() {
            res.status(200).end();
        });
    });

    app.post("/pids", bodyParser.json(), function(req, res) {
        register.newInfo(req.body)
            .then(function(id) {
                res.status(200).send(id);
            })
    });
    app.listen(config.port);
    return app;
}
