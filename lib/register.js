var NEW = require("pid-async-class").nEw;
var ScheduleAsync = require("pid-async-class").ScheduledAsync;
var PouchDB = require("pouchdb");
var RegisterInfo = require("./register-info");

class Register extends ScheduleAsync {
  constructor(){
    super();
    this.db = new PouchDB("register");
    this.intervalCheck(5000);
  }

  intervalCheck(interval){
    this.schedule(interval, "checkHeartbeats",[]);
  }

  async checkHeartbeats(){

    var infos = await this.getInfos();
    var changes = [];
    var deregister = [];
    for(var i in infos){
      if((Date.now() - infos[i].lastHeartbeatTime) >  infos[i].registerConfig.heartbeatInterval * (infos[i].numberOfMisses + 1)){
        if(infos[i].numberOfMisses + 1 > infos[i].registerConfig.maxMisses){
          deregister.push(infos[i]);
        } else {
          infos[i].numberOfMisses++;
          changes.push(infos[i]);
        }
      }
    }

    this.deregisterInfos(deregister);
    this.updateInfos(changes);

    return true;
  }

  async getInfos(){
    return this.db.allDocs({
      include_docs: true
    }).then((docs) => {
      return docs.rows.map(function(doc){
        return new RegisterInfo(doc && doc.doc);
      })
    })
  }

  async getInfosByClass(pidClass){
    return this.db.allDocs({
      include_docs: true
    }).then((docs) => {
      return docs.rows.map(function(doc){
        return new RegisterInfo(doc && doc.doc);
      }).filter(function(doc){
        return doc.pidClass === pidClass;
      })
    })
  }

  deregisterInfos(infos){
    for(var i in infos){
      this.db.remove(infos[i]);
    }
  }

  updateInfos(infos){
    for(var i in infos){
      this.db.put(infos[i]);
    }
  }

  getInfo(id){
    return this.db.get(id).then(function(doc){
      return new RegisterInfo(doc)
    }).catch(function(){
      return null
    });
  }

  async newInfo(doc){
    var rInfo = new RegisterInfo(doc);
    rInfo._id = rInfo.pidId + "_" + (rInfo.port || rInfo.securePort) + "_" + rInfo.hostName + "_" + rInfo.ipAddr
    this.intervalCheck(rInfo.registerConfig.heartbeatInterval);
    var doc = await this.getInfo(rInfo._id)
    if(!doc){
      await this.db.put(rInfo);
    }

    return rInfo._id;
  }

  async heartbeatReceived(id){
    var info = await this.getInfo(id);
    info.lastHeartbeatTime = Date.now();
    info.numberOfMisses = 0;
    this.updateInfos([info])
    return true;
  }
}

module.exports = Register;
