var install = require("installation-station");
var PouchDB = require("pouchdb");

(async function() {
    await install("pid-server", 1, [{
        question: "What port should I run on?: ",
        format: "INT",
        key: "port",
        defaultValue: 6565
    }], "local")
})()
