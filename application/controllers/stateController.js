var logger = require("winston"),
    gotv = require("../services/gotv.js"),
    helper = require("../_helper.js");

function getStates(request, response) {
  var states = {};
  var stateNames = helper.getStateList();
  
  var vars = {};
  vars.states = stateNames;
  
  helper.addSavedMessages(request, response, vars);
  helper.renderHTML(response, "states.html", vars);
}

function getStateDetails(request, response) {
  var state = request.param("state"),
      vars = {};
  
  vars.stateId = state;
  
  helper.addSavedMessages(request, response, vars);
  helper.renderHTML(response, "state_details.html", vars);
}


function getStateList(request, response) {
  var vars = {};
  gotv.getStates(function (error, data) {
    if (error) {
      vars.error = error;
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.states = data.STATES;
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "states.html", vars);
  });
}
function getStateById(request, response) {
  var vars = {};
  var state = request.param("state");
  gotv.getStateById(state, function(error, data) {
    if (error) {
      vars.error = error;
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.state = data.STATE[0];
      vars.stateId = vars.state.State;
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "state_details.html", vars);
  });
}
function updateStateInfo(request, response) {
  var State = request.param("state"),
      City = request.param("City"),
      Zip = request.param("Zip"),
      ABOfficeName = request.param("ABOfficeName"),
      Address1 = request.param("Address1"),
      Address2 = request.param("Address2"),
      HasEarlyVote = request.param("HasEarlyVote"),
      ABUseEmailProcess = request.param("ABUseEmailProcess"),
      RegUseEmailProcess = request.param("RegUseEmailProcess"),
      ABUseCountyClerkContactInfo = request.param("ABUseCountyClerkContactInfo"),
      EmailAddress = request.param("EmailAddress"),
      RegUseCountyClerkContactInfo = request.param("RegUseCountyClerkContactInfo"),
      RegOfficeName = request.param("RegOfficeName"),
      RegAddress1 = request.param("RegAddress1"),
      RegAddress2 = request.param("RegAddress2"),
      RegCity = request.param("RegCity"),
      RegZip = request.param("RegZip"),
      RegEmailAddress = request.param("RegEmailAddress"),
      EDWebsite = request.param("EDWebsite"),
      details = {},
      vars = {};
  
  details.HasEarlyVote = (HasEarlyVote == 'on') ? 1 : 0;
  details.ABUseEmailProcess = (ABUseEmailProcess == 'on') ? 1 : 0;
  details.RegUseEmailProcess = (RegUseEmailProcess == 'on') ? 1 : 0;
  details.ABUseCountyClerkContactInfo = (ABUseCountyClerkContactInfo == 'on') ? 1 : 0;
  details.RegUseCountyClerkContactInfo = (RegUseCountyClerkContactInfo == 'on') ? 1 : 0;
  details.ABOfficeName = ABOfficeName;
  details.Address1 = Address1;
  details.Address2 = Address2;
  details.City = City;
  details.State = State;
  details.Zip = Zip;
  details.EmailAddress = EmailAddress;
  details.RegOfficeName = RegOfficeName;
  details.RegAddress1 = RegAddress1;
  details.RegAddress2 = RegAddress2;
  details.RegCity = RegCity;
  details.RegZip = RegZip;
  details.RegEmailAddress = RegEmailAddress;
  details.EDWebsite = EDWebsite;
  
  gotv.updateStateDetails(details, function(error, data) {
    if (error) {
      vars.error = error;
      vars.message = {message:error.error,type:"error"};
      // persist the information...
      vars.state = details;
      vars.stateId = State;
    } else {
      response.cookie("message", {message:"State details updated",type:"success"});
      vars.stateId = State;
      response.redirect("/"+vars.stateId);
      return;
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "state_details.html", vars);
  });
      
}

function getVoterFile(request, response) {
  var state = request.param("state"),
      vars = {};
  
  var state = request.param("state");
  gotv.getStateById(state, function(error, data) {
    if (error) {
      vars.error = error;
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.state = data.STATE[0];
      vars.stateId = vars.state.State;
      gotv.getVoterFile(function (error, data) {
        if (error) {
          vars.error = error;
          vars.message = {mesage:error.error,type:"error"};
        } else {
          vars.state.download_link = data.SPREADSHEETURL;
        }
        helper.addSavedMessages(request, response, vars);
        helper.renderHTML(response, "voter_dl.html", vars);
      });
    }
  });
  
  
}


function StateController() {}
StateController.prototype.getStates = getStateList;
StateController.prototype.getStateDetails = getStateById;
StateController.prototype.updateStateInfo = updateStateInfo;
StateController.prototype.getVoterFile = getVoterFile;
module.exports = new StateController();