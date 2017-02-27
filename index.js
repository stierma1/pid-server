var Config = require("./configurator");
var NEW = require("pid-async-class").nEw;
var server = require("./lib/server");

(async function(){
  var config = await NEW(Config);
  var configDoc = await config.getConfiguration();
  server(configDoc);
})()
