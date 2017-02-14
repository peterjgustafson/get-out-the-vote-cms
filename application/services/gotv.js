var requests = require("request"),
    logger = require("winston"),
    helper = require("../_helper"),
    services = require("./services"),
    mock = require("./mocks");

function getElections(callback) {
  callback = (typeof callback === 'undefined') ? function (error, response) {} : callback;
  
  var url = helper.base_url+helper.elections_url+helper.list_url;
  
  if (helper.mock) {
    callback(null, mock.getElectionsByState());
  } else {
    logger.debug("<<<<<<<<<< service.getElections >>>>>>>>>>");
    services.get(url, callback);
    logger.debug(">>>>>>>>>> service.getElections <<<<<<<<<<");
  }
}


function getElectionsByState(stateId, callback) {
  callback = (typeof callback === 'undefined') ? function (error, response){} : callback;
  
  if (typeof stateId === 'function') {
    callback = stateId;
    callback({error:"No state defined"}, null);
  } else if (typeof stateId === 'undefined') {
    callback({error:"No state defined"}, null);
  } else {
    var url = helper.base_url+helper.elections_url+helper.list_url+"?state="+stateId;

    if (helper.mock) {
      callback(null, mock.getElectionsByState());
    } else {
      logger.debug("<<<<<<<<<< service:getElectionsByState >>>>>>>>>>");
      services.get(url, callback);
      logger.debug(">>>>>>>>>> service:getElectionsByState >>>>>>>>>>");
    }
  }
}

function getElectionById(electionId, callback) {
  
  callback = (typeof callback === 'undefined') ? function (error, response){} : callback;
  
  if (typeof electionId === 'function') {
    callback = electionId;
    callback({error:"No election selected"}, null);
  } else if (typeof electionId === 'undefined') {
    callback({error:"No election selected"}, null);
  } else {
    var url = helper.base_url+helper.elections_url+"/"+electionId;

    if (helper.mock) {
      callback(null, mock.getElectionById());
    } else {
      logger.debug("<<<<<<<<<< service:getElectionById >>>>>>>>>>");
      services.get(url, callback);
      logger.debug(">>>>>>>>>> service:getElectionById <<<<<<<<<<");
    }
  }
}

function addElection(election, callback) {
  callback = (typeof callback === 'undefined') ? function (error, response) {} : callback;
  if (typeof election === 'function') {
    callback = election;
    callback({error:"Election not defined"}, null);
  } else {
    var url = helper.base_url+helper.elections_url;
    if (helper.mock) {
      callback(null, mock.addElection());
    } else {
      logger.debug("<<<<<<<<<< service:addElection >>>>>>>>>>");
      services.post(url, {form:election}, callback, "add election failed");
      logger.debug(">>>>>>>>>> service:addElection <<<<<<<<<<");
    }
  }
}

function updateElection(election, electionId, callback) {
  var url = helper.base_url+helper.elections_url+"/"+electionId;
  if (helper.mock) {
    callback(null, mock.updateElection());
  } else {
    var req = JSON.stringify({"Election":[election]});
    logger.debug("<<<<<<<<<< service:updateElection >>>>>>>>>>");
    services.put(url, req, callback, "Update election failed");
    logger.debug(">>>>>>>>>> service:updateElection <<<<<<<<<<");
  }
}

function deleteElection(electionId, callback) {
  var url = helper.base_url+helper.elections_url+"/"+electionId;
  if (helper.mock) {
    callback(null, mock.deleteElection());
  } else {
    logger.debug("<<<<<<<<< service:deleteElection >>>>>>>>>>");
    services.del(url, callback, "Delete election failed");
  }
}

/**
 *
 */
function getEVLocationsByState(stateId, callback) {
  if (typeof stateId === 'function') {
  } else {
    var url = helper.base_url+helper.locations_url+helper.list_url+"?State="+stateId+"&startRow=1&maxRows=10000";
  
    if (helper.mock) {
      callback(null, mock.getLocationsByState());
    } else {
      logger.debug("<<<<<<<<<< service:getLocationsByState >>>>>>>>>>");
      services.get(url, callback, "Unable to get locations");
      logger.debug(">>>>>>>>>> service:getLocationsByState >>>>>>>>>>");
    }
  }
}

function getEVLocationById(locationId, callback) {
  callback = (typeof callback === 'undefined') ? function(error, response) {} : callback;
  if (typeof locationId === 'function') {
    callback = locationId;
    callback({error:"No location defined"}, null);
  } else {
    var url = helper.base_url+helper.locations_url+"/"+locationId;
    if (helper.mock) {
      callback(null, mock.getEarlyVotingLocationById());
    } else {
      logger.debug("<<<<<<<<<< service:getEVLocationById >>>>>>>>>>");
      services.get(url, callback);
      logger.debug(">>>>>>>>>> service:getEVLocationById <<<<<<<<<<");
    }
  }
}

function addEVLocation(location, callback) {
  callback = (typeof callback === 'undefined') ? function (error, response) {} : callback;
  if (typeof location === 'function') {
    callback = location;
    callback({error:"Location not defined"}, null);
  } else {
    var url = helper.base_url+helper.locations_url;
    if (helper.mock) {
      callback(null, mock.addEVLocation());
    } else {
      logger.debug("<<<<<<<<<< service:addEarlyVoteLocation >>>>>>>>>>");
      services.post(url, {form:location}, callback, "add vote location failed");
      logger.debug(">>>>>>>>>> service:addEarlyVoteLocation <<<<<<<<<<");
    }
  }
}

function updateEVLocation(location, locationId, callback) {
  var url = helper.base_url+helper.locations_url+"/"+locationId;
  if (helper.mock) {
    callback(null, mock.updateEVLocation());
  } else {
    var req = JSON.stringify({"Location":[location]});
    logger.debug("<<<<<<<<<< service:updateLocation >>>>>>>>>>");
    services.put(url, req, callback, "Update location failed");
    logger.debug(">>>>>>>>>> service:updateLocation <<<<<<<<<<");
  }
}

function deleteEVLocation(locationId, callback) {
  var url = helper.base_url+helper.locations_url+"/"+locationId;
  if (helper.mock) {
    callback(null, mock.deleteEVLocation());
  } else {
    logger.debug("<<<<<<<<<< service:deleteEVLocation >>>>>>>>>>");
    services.del(url, callback, "Delete location failed.");
  }
}


/**
 *
 */
function getStates(callback) {
  var url = helper.base_url+helper.states_url+helper.list_url;
  callback = (typeof callback === 'undefined') ? function(error, body) {} : callback;
  if (helper.mock) {
    callback(null, mock.getStates());
  } else {
    logger.debug("<<<<<<<<<< service:getStates >>>>>>>>>>");
    services.get(url, callback);
    logger.debug(">>>>>>>>>> service:getStates <<<<<<<<<<");
  }
}

function getStateById(state, callback) {
  var url = helper.base_url+helper.states_url+"/"+state;
  callback = (typeof callback === 'undefined') ? function(error, body) {} : callback;
  if (helper.mock) {
    callback(null, mock.getStateById());
  } else {
    logger.debug("<<<<<<<<<< service:getStateById >>>>>>>>>>");
    services.get(url, callback);
    logger.debug(">>>>>>>>>> service:getStateById <<<<<<<<<<");
  }
}

function updateStateDetails(details, callback) {
  var url = helper.base_url+helper.states_url+"/"+details.State;
  callback = (typeof callback === 'undefined') ? function(error,data){} : callback;
  if (helper.mock) {
    callback(null, mock.updateStateDetails());
  } else {
    var req = JSON.stringify({"STATE":[details]});
    logger.debug("<<<<<<<<<< service:updateStateDetails >>>>>>>>>>");
    services.put(url, req, callback, "Save state failed");
  }
}


function getCountiesByState(state, callback) {
  var url = helper.base_url+helper.states_url+helper.counties_url+helper.list_url+"/"+state;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback(null, mock.getCountiesByState());
  } else {
    logger.debug("<<<<<<<<<< service:getCountiesByState >>>>>>>>>>");
    services.get(url, callback);
  }
}

function getCountyById(county, callback) {
  var url = helper.base_url+helper.states_url+helper.counties_url+"/"+county;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback(null, mock.getCountyById());
  } else {
    logger.debug("<<<<<<<<<< service:getCountyById >>>>>>>>>>");
    services.get(url, callback);
  }
}

function updateCounty(county, countyId, callback) {
  var url = helper.base_url+helper.states_url+helper.counties_url+"/"+countyId;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback(null, mock.updateCounty());
  } else {
    var req = JSON.stringify({"County":[county]});
    logger.debug("<<<<<<<<<< service:updateCounty >>>>>>>>>>");
    services.put(url, req, callback, "Save county failed");
  }
}

function getMunicipalitiesByCountyId(countyId, callback) {
  var url = helper.base_url+helper.states_url+helper.counties_url+helper.municipalities_url+helper.list_url+"/"+countyId;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback(null, mock.getMunicipalitiesByCountyId());
  } else {
    logger.debug("<<<<<<<<<< service:getMunicipalitiesByCountyId >>>>>>>>>>");
    logger.debug(url);
    services.get(url, callback);
  }
}

function getMunicipalityById(municipality, callback) {
  var url = helper.base_url+helper.states_url+helper.municipalities_url+"/"+municipality;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback(null, mock.getMunicipalityById());
  } else {
    logger.debug("<<<<<<<<<< service:getMunicipalityById >>>>>>>>>>");
    services.get(url, callback);
  }
}

function addMunicipality(municipality, callback) {
  var url = helper.base_url+helper.states_url+helper.municipalities_url;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback(null, mock.addMunicipality());
  } else {
    logger.debug("<<<<<<<<<< service:addMunicipality >>>>>>>>>>");
    services.post(url,{form:municipality}, callback, "add municipality failed");
  }
}

function updateMunicipality(municipality, callback) {
  var url = helper.base_url+helper.states_url+helper.municipalities_url+"/"+municipality.MunicipalityId;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback(null, mock.updateMunicipality());
  } else {
    var req = JSON.stringify({"Municipality":[municipality]});
    logger.debug("<<<<<<<<<< service:updateMunicipality >>>>>>>>>>");
    services.put(url, req, callback, "Save municipality failed");
  }
}

function getVoterFile(callback) {
  var url = helper.base_url+helper.voters_url;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback(null, mock.getVoterFile());
  } else {
    logger.debug("<<<<<<<<<< service:getVoterFile >>>>>>>>>>");
    services.get(url, callback);
  }
}

function getVoterFileByClientId(client, callback) {
  var url = helper.base_url+"/Voters/voterFile/"+client;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback(null, mock.getVoterFile());
  } else {
    logger.debug("<<<<<<<<<< service:getVoterFileByClientId >>>>>>>>>>");
    services.get(url, callback);
  }
}

function getClients(callback) {
  var url = helper.base_url+helper.clients_url;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback({error:"mock function not defined"}, null);
  } else {
    logger.debug("<<<<<<<<<< service:getClients >>>>>>>>>>");
    services.get(url, callback);
  }
}

function getClientById(client, callback) {
  var url = helper.base_url+helper.clients_url+"/"+client;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback({error:"mock function not defined"}, null);
  } else {
    logger.debug("<<<<<<<<<< service:getClientById >>>>>>>>>>");
    services.get(url, callback);
  }
}

function addClient(client, callback) {
  var url = helper.base_url+helper.clients_url;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback({error:"mock function not defined"},null);
  } else {
    logger.debug("<<<<<<<<<< service:addClient >>>>>>>>>>");
    services.post(url,{form:client}, callback, "Add client failed");
  }
}

function updateClient(client, clientId, callback) {
  var url = helper.base_url+helper.clients_url+"/"+clientId;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
  } else {
    logger.debug("<<<<<<<<<< service:updateClient >>>>>>>>>>");
    var req = JSON.stringify({"Client":[client]});
    services.put(url, req, callback, "Save client failed."); 
  }
}

function getDomainsByClient(client, callback) {
  var url = helper.base_url+helper.domains_url+"/"+client;
  callback = (typeof callback === 'undefined') ? function (error, data) {} : callback;
  if (helper.mock) {
    callback({error:"mock function not defined"}, null);
  } else {
    logger.debug("<<<<<<<<<< service:getDomainsByClient >>>>>>>>>>");
    services.get(url, callback);
  }
}

function addDomain(client, domain, callback) {
  var url = helper.base_url+helper.domains_url+"/"+client;
  callback = (typeof callback === 'undefined') ? function(error, data) {} : callback;
  
  if (helper.mock) {
    callback({error:"mock function not defined"});
  } else {
    logger.debug("<<<<<<<<<< services:addDomain >>>>>>>>>>");
    services.post(url, {form: domain}, callback, "Add domain failed");
  }
}

function deleteDomain(domain, callback) {
  var url = helper.base_url+helper.domains_url+"/"+domain;
  callback = (typeof callback === 'undefined') ? function(error, data) {} : callback;
  
  if (helper.mock) {
    callback({error:"mock function not defined"});
  } else {
    logger.debug("<<<<<<<<<< services:deleteDomain >>>>>>>>>>");
    services.del(url, callback);
  }
}






function GOTV() {}

GOTV.prototype.getElections = getElections;
GOTV.prototype.getElectionsByState = getElectionsByState;
GOTV.prototype.getElectionById = getElectionById;
GOTV.prototype.addElection = addElection;
GOTV.prototype.updateElection = updateElection;
GOTV.prototype.deleteElection = deleteElection;

GOTV.prototype.getStates = getStates;
GOTV.prototype.getStateById = getStateById;
GOTV.prototype.updateStateDetails = updateStateDetails;

GOTV.prototype.getCountiesByState = getCountiesByState;
GOTV.prototype.getCountyById = getCountyById;
GOTV.prototype.updateCounty = updateCounty;

GOTV.prototype.getMunicipalitiesByCountyId = getMunicipalitiesByCountyId;
GOTV.prototype.getMunicipalityById = getMunicipalityById;
GOTV.prototype.addMunicipality = addMunicipality;
GOTV.prototype.updateMunicipality = updateMunicipality;

GOTV.prototype.getEVLocationsByState = getEVLocationsByState;
GOTV.prototype.getEVLocationById = getEVLocationById;
GOTV.prototype.addEVLocation = addEVLocation;
GOTV.prototype.updateEVLocation = updateEVLocation;
GOTV.prototype.deleteEVLocation = deleteEVLocation;

GOTV.prototype.getVoterFile = getVoterFile;
GOTV.prototype.getVoterFileByClientId = getVoterFileByClientId;

GOTV.prototype.getClients = getClients;
GOTV.prototype.getClientById = getClientById;
GOTV.prototype.addClient = addClient;
GOTV.prototype.updateClient = updateClient;
GOTV.prototype.getDomainsByClient = getDomainsByClient;

GOTV.prototype.addDomain = addDomain;
GOTV.prototype.deleteDomain = deleteDomain;

module.exports = new GOTV();