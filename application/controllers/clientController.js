var logger = require("winston"),
    gotv = require("../services/gotv.js"),
    helper = require("../_helper.js");

function getClients(request, response) {
  var vars = {};
  gotv.getClients(function(error, data) {
    vars.clients = data.CLIENT;
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "clients.html", vars);
  });
}

function getClientById(request, response) {
  var client = request.param("clientId"),
      vars = {};
  
  gotv.getClientById(client, function(error, data) {
    vars.client = data.CLIENT;
    gotv.getDomainsByClient(client, function(error2, data2) {
      vars.client[0].domains = data2.DOMAINS;
      logger.debug(vars);
      helper.addSavedMessages(request, response, vars);
      helper.renderHTML(response, "client.html", vars);
    });
  });
}

function newClient(request, response) {
  var vars = {};
  helper.addSavedMessages(request, response, vars);
  helper.renderHTML(response, "new_client.html", vars);
}

function addClient(request, response) {
  var ClientName = request.param("ClientName"),
      SendersName = request.param("SendersName"),
      SendersEmailAddress = request.param("SendersEmailAddress"),
      ClientEmailHeader = request.param("ClientEmailHeader"),
      ClientEmailFooter = request.param("ClientEmailFooter"),
      ClientABEmailCopy = request.param("ClientABEmailCopy"),
      ClientABEmail_ForEmailProcess = request.param("ClientABEmail_ForEmailProcess"),
      ClientVotingLocEmailCopy = request.param("ClientVotingLocEmailCopy"),
      ClientRegEmailCopy = request.param("ClientRegEmailCopy"),
      ClientCode = request.param("ClientCode"),
      PostmarkAPIKey = request.param("PostmarkAPIKey"),
      EDayLocationEmail = request.param("EDayLocationEmail"),
      CommitEmailCopy = request.param("CommitEmailCopy"),
      details = {},
      vars = {};
  details.ClientName = ClientName;
  details.SendersName = SendersName;
  details.SendersEmailAddress = SendersEmailAddress;
  details.ClientEmailHeader = ClientEmailHeader;
  details.ClientEmailFooter = ClientEmailFooter;
  details.ClientABEmailCopy = ClientABEmailCopy;
  details.ClientABEmail_ForEmailProcess = ClientABEmail_ForEmailProcess;
  details.ClientVotingLocEmailCopy = ClientVotingLocEmailCopy;
  details.ClientRegEmailCopy = ClientRegEmailCopy;
  details.ClientCode = ClientCode;
  details.PostmarkAPIKey = PostmarkAPIKey;
  details.EDayLocationEmail = EDayLocationEmail;
  details.CommitEmailCopy = CommitEmailCopy;
  
  gotv.addClient(details, function(error, data) {
    if (error) {
      vars.message = {message:error.error,type:"error"};
      vars.client = details;
    } else {
      vars.message = {message:"Client details saved", type:"success"};
      response.cookie("message",vars.message);
      response.redirect("/client/"+data.CLIENT.ClientId);
    }
  });
}

function updateClient(request, response) {
  var ClientId = request.param("clientId"),
      ClientName = request.param("ClientName"),
      SendersName = request.param("SendersName"),
      SendersEmailAddress = request.param("SendersEmailAddress"),
      ClientEmailHeader = request.param("ClientEmailHeader"),
      ClientEmailFooter = request.param("ClientEmailFooter"),
      ClientABEmailCopy = request.param("ClientABEmailCopy"),
      ClientABEmail_ForEmailProcess = request.param("ClientABEmail_ForEmailProcess"),
      ClientVotingLocEmailCopy = request.param("ClientVotingLocEmailCopy"),
      ClientRegEmailCopy = request.param("ClientRegEmailCopy"),
      ClientCode = request.param("ClientCode"),
      PostmarkAPIKey = request.param("PostmarkAPIKey"),
      EDayLocationEmail = request.param("EDayLocationEmail"),
      CommitEmailCopy = request.param("CommitEmailCopy"),
      details = {},
      vars = {};
  details.ClientId = ClientId;
  details.ClientName = ClientName;
  details.SendersName = SendersName;
  details.SendersEmailAddress = SendersEmailAddress;
  details.ClientEmailHeader = ClientEmailHeader;
  details.ClientEmailFooter = ClientEmailFooter;
  details.ClientABEmailCopy = ClientABEmailCopy;
  details.ClientABEmail_ForEmailProcess = ClientABEmail_ForEmailProcess;
  details.ClientVotingLocEmailCopy = ClientVotingLocEmailCopy;
  details.ClientRegEmailCopy = ClientRegEmailCopy;
  details.ClientCode = ClientCode;
  details.PostmarkAPIKey = PostmarkAPIKey;
  details.EDayLocationEmail = EDayLocationEmail;
  details.CommitEmailCopy = CommitEmailCopy;
  
  gotv.updateClient(details, ClientId, function(error, data) {
    if (error) {
      vars.message = {message:error.error,type:"error"};
      vars.client = details;
    } else {
      vars.message = {message:"Client details saved",type:"success"};
      response.cookie("message",vars.message);
      response.redirect("/client/"+ClientId);
      return;
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "client.html", vars);
  });
}

function getVoterFile(request, response) {
  var clientId = request.param("clientId");
  gotv.getVoterFileByClientId(clientId, function(error, data) {
    if (error) {
      response.send(500);
    } else {
      response.send(data.SPREADSHEETURL);
    }
  });
}


function ClientController() {}
ClientController.prototype.getClients = getClients;
ClientController.prototype.getClientById = getClientById;
ClientController.prototype.newClient = newClient;
ClientController.prototype.addClient = addClient;
ClientController.prototype.updateClient = updateClient;
ClientController.prototype.getVoterFile = getVoterFile;

module.exports = new ClientController();