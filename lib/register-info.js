
class RegisterInfo {
  constructor(config){
      this._id = config._id;
      this._rev = config._rev;
      this.pidId = config.pidId;
      this.pidClass = config.pidClass;
      this.hostName = config.hostName;
      this.port = config.port;
      this.securePort = config.securePort;
      this.ipAddr = config.ipAdd;
      this.sateliteInfo = config.sateliteInfo;
      this.initialCreationTime = config.initialCreationTime || Date.now();
      this.lastHeartbeatTime = config.lastHeartbeatTime || Date.now();
      this.status = config.status || "UP";
      this.healthcheckUrl = config.healthcheckUrl;
      this.registerConfig = config.registerConfig || {

      }
      this.registerConfig.heartbeatInterval = this.registerConfig.heartbeatInterval || 30000;
      this.registerConfig.maxMisses = this.registerConfig.maxMisses || 5;
      this.numberOfMisses = config.numberOfMisses || 0;
  }

  validate(){
    return (this.pidId && (this.port || this.securePort) && (this.hostName || this.ipAddr) && true) || false;
  }

  serialize(){
    return JSON.stringify(this);
  }
}

module.exports = RegisterInfo;
