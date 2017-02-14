var logger = require("winston"),
    gotv = require("../services/gotv.js"),
    helper = require("../_helper.js");


function getElections(request, response) {
  gotv.getElections(function (error, data) {
    var vars = {};
    
    if (error) {
      vars.error = error;
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.elections = data.ELECTIONS;
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "elections.html", vars);
  });
}

function getElectionsByState(request, response) {
  var state = request.param("state");
  
  gotv.getElectionsByState(state, function (error, data) {
    var vars = {};
    
    vars.stateId = state;
    vars.StateName = helper.getStateById(state);
    
    if (error) {
      vars.error = error;
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.elections = data.ELECTIONS;
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "state_elections.html", vars);
  });
}

function addNewElection(request, response) {
  var state = request.param("state"),
      vars = {};
  vars.stateId = state;
  vars.stateName = helper.getStateById(state);
  helper.addSavedMessages(request, response, vars);
  helper.renderHTML(response, "new_election.html", vars);
}

function getElectionById(request, response) {
  var state = request.param("state"),
      election = request.param("electionId"),
      vars = {};
  
  gotv.getElectionById(election, function (error, data) {
    vars.stateId = state;
    vars.electionId = election;

    if (error) {
    } else {
      var el = data.ELECTION[0];
      vars.election = data.ELECTION[0];

      vars.election.ElectionDate = helper.formatDateHelper(el.ElectionDate);
      vars.election.RegistrationEndDate = helper.formatDateHelper(el.RegistrationEndDate);
      vars.election.ABEndDate = helper.formatDateHelper(el.ABEndDate);
      vars.election.ABStartDate = helper.formatDateHelper(el.ABStartDate);
      vars.election.EVStartDate = helper.formatDateHelper(el.EVStartDate);
      vars.election.EVEndDate = helper.formatDateHelper(el.EVEndDate);
      vars.election.EDStartDate = helper.formatDateHelper(el.EDStartDate);
      vars.election.EDEndDate = helper.formatDateHelper(el.EDEndDate);
    }
    
    helper.addSavedMessages(request,response,vars);
    helper.renderHTML(response, "election.html", vars);
  });
}

function saveElectionById(request, response) {
  var State = request.param("state"),
      ElectionId = request.param("electionId"),
      ElectionName = request.param("ElectionName"),
      ElectionDate = request.param("ElectionDate"),
      RegistrationEndDate = request.param("RegistrationEndDate"),
      EVStartDate = request.param("EVStartDate"),
      EVEndDate = request.param("EVEndDate"),
      ABStartDate = request.param("ABStartDate"),
      ABEndDate = request.param("ABEndDate"),
      ABEmailAddress = request.param("ABEmailAddress"),
      ABRequestPDFPath = request.param("ABRequestPDFPath"),
      EDStartDate = request.param("EDStartDate"),
      EDEndDate = request.param("EDEndDate"),
      EDUseGoogleCivic = request.param("EDUseGoogleCivic"),
      ABEndDisplayDate = request.param("ABEndDisplayDate"),
      EVEndDisplayDate = request.param("EVEndDisplayDate"),
      vars = {},
      data = {};
  
  data.State = State;
  data.ElectionName = ElectionName;
  data.ElectionDate = ElectionDate;
  data.RegistrationEndDate = RegistrationEndDate;
  data.EVStartDate = EVStartDate;
  data.EVEndDate = EVEndDate;
  data.ABStartDate = ABStartDate;
  data.ABEndDate = ABEndDate;
  data.ABEmailAddress = ABEmailAddress;
  data.ABRequestPDFPath = ABRequestPDFPath;
  data.EDStartDate = EDStartDate;
  data.EDEndDate = EDEndDate;
  data.EDUseGoogleCivic = (EDUseGoogleCivic == 'on') ? 1 : 0;
  data.ABEndDisplayDate = ABEndDisplayDate;
  data.EVEndDisplayDate = EVEndDisplayDate;
  
  var displayElection = function(error, resp) {
    var vars = {};
    if (error) {
      vars.message = {message:error.error,type:"error"};
      vars.stateId = data.State;
      vars.stateName = helper.getStateById(data.State);
      vars.electionId = ElectionId;
      vars.election = data;
      
    } else {
      vars.message = {message:"Saved election.",type:"success"};
      
      response.cookie("message", vars.message);

      var el = resp.ELECTION[0];
      vars.election = resp.ELECTION[0];

      vars.election.ElectionDate = helper.formatDateHelper(el.ElectionDate);
      vars.election.RegistrationEndDate = helper.formatDateHelper(el.RegistrationEndDate);
      vars.election.ABEndDate = helper.formatDateHelper(el.ABEndDate);
      vars.election.ABStartDate = helper.formatDateHelper(el.ABStartDate);
      vars.election.EVStartDate = helper.formatDateHelper(el.EVStartDate);
      vars.election.EVEndDate = helper.formatDateHelper(el.EVEndDate);
      vars.election.EVEndDisplayDate = helper.formatDateHelper(el.EVEndDisplayDate);
      vars.election.ABEndDisplayDate = helper.formatDateHelper(el.ABEndDisplayDate);

      vars.electionId = el.ElectionId;
      vars.stateId = el.State;
      vars.stateName = helper.getStateById(el.State);
      
      response.redirect("/"+el.State+"/election/"+el.ElectionId);
      return;
    }

    helper.renderHTML(response, "election.html", vars);
  }
  
  gotv.updateElection(data, ElectionId, displayElection);
}

function saveNewElection(request, response) {
  var State = request.param("state"),
      ElectionName = request.param("ElectionName"),
      ElectionDate = request.param("ElectionDate"),
      RegistrationEndDate = request.param("RegistrationEndDate"),
      EVStartDate = request.param("EVStartDate"),
      EVEndDate = request.param("EVEndDate"),
      ABStartDate = request.param("ABStartDate"),
      ABEndDate = request.param("ABEndDate"),
      ABEmailAddress = request.param("ABEmailAddress"),
      ABRequestPDFPath = request.param("ABRequestPDFPath"),
      EDStartDate = request.param("EDStartDate"),
      EDEndDate = request.param("EDEndDate"),
      EDUseGoogleCivic = request.param("EDUseGoogleCivic"),
      ABEndDisplayDate = request.param("ABEndDisplayDate"),
      EVEndDisplayDate = request.param("EVEndDisplayDate"),
      vars = {},
      data = {};
  
  data.State = State;
  data.ElectionName = ElectionName;
  data.ElectionDate = ElectionDate;
  data.RegistrationEndDate = RegistrationEndDate;
  data.EVStartDate = EVStartDate;
  data.EVEndDate = EVEndDate;
  data.ABStartDate = ABStartDate;
  data.ABEndDate = ABEndDate;
  data.ABEmailAddress = ABEmailAddress;
  data.ABRequestPDFPath = ABRequestPDFPath;
  data.RegMicroFormat = "";
  data.EDStartDate = EDStartDate;
  data.EDEndDate = EDEndDate;
  data.EDUseGoogleCivic = (EDUseGoogleCivic == 'on') ? 1 : 0;
  data.ABEndDisplayDate = ABEndDisplayDate;
  data.EVEndDisplayDate = EVEndDisplayDate;
  
  var displayElection = function(error, resp) {
    var vars = {};
    if (error) {
      vars.message = {message:error.error,type:"error"};
      vars.stateId = State;
      vars.stateName = helper.getStateById(State);
    } else {
      vars.message = {message:"Saved election.",type:"success"};
      response.cookie("message", vars.message);
      resp = JSON.parse(resp);

      var el = resp.ELECTION[0];
      vars.election = resp.ELECTION[0];

      vars.election.ElectionDate = helper.formatDateHelper(el.ElectionDate);
      vars.election.RegistrationEndDate = helper.formatDateHelper(el.RegistrationEndDate);
      vars.election.ABEndDate = helper.formatDateHelper(el.ABEndDate);
      vars.election.ABStartDate = helper.formatDateHelper(el.ABStartDate);
      vars.election.EVStartDate = helper.formatDateHelper(el.EVStartDate);
      vars.election.EVEndDate = helper.formatDateHelper(el.EVEndDate);
      vars.election.EDStartDate = helper.formatDateHelper(el.EDStartDate);
      vars.election.EDEndDate = helper.formatDateHelper(el.EDEndDate);
      vars.election.EVEndDisplayDate = helper.formatDateHelper(el.EVEndDisplayDate);
      vars.election.ABEndDisplayDate = helper.formatDateHelper(el.ABEndDisplayDate);

      vars.electionId = el.ElectionId;
      vars.stateId = el.State;
      vars.stateName = helper.getStateById(el.State);
      
      response.redirect("/"+el.State+"/elections");
      return;
    }

    helper.renderHTML(response, "election.html", vars);
  }
  
   vars.stateId = State; 
  gotv.addElection(data, displayElection);
}

function deleteElectionById(request, response) {
  var state = request.param("state"),
      election = request.param("electionId");
  gotv.deleteElection(election, function (error, data) {
    if (error) {
      logger.error(error);
      response.cookie("message", {message:"Error deleting election",type:"error"});
      response.send(500);
    } else {
      response.cookie("message", {message:"Election deleted",type:"success"});
      response.send(200);
    }
  });
}

function ElectionController() {}
ElectionController.prototype.getElections = getElections;
ElectionController.prototype.getElectionsByState = getElectionsByState;
ElectionController.prototype.getElectionById = getElectionById;
ElectionController.prototype.addNewElection = addNewElection;
ElectionController.prototype.saveNewElection = saveNewElection;
ElectionController.prototype.saveElectionById = saveElectionById;
ElectionController.prototype.deleteElectionById = deleteElectionById;
module.exports = new ElectionController();