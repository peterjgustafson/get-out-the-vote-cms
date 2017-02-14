var logger = require("winston"),
    gotv = require("../services/gotv.js"),
    helper = require("../_helper.js");

function addDomain(request, response) {
  var clientId = request.param("clientId"),
      domain = request.param("domain"),
      details = {};
  details.DomainName = domain;
  gotv.addDomain(clientId, details, function(error, data) {
    if (error) {
      response.send(422);
    } else {
      response.send(200);
    }
  });
}

function deleteDomain(request, response) {
  var url = request.param("url"),
      details = {};
  
  gotv.deleteDomain(url, function(error, data) {
    if (error) {
      logger.debug(error);
      response.send(422);
    } else {
      response.send(200);
    }
  });
}

function DomainController() {}
DomainController.prototype.addDomain = addDomain;
DomainController.prototype.deleteDomain = deleteDomain;

module.exports = new DomainController();