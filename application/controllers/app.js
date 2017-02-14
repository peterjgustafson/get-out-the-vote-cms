var winston = require("winston"),
    gotv = require("../services/gotv"),
    helper = require("../_helper");


function home(request, response) {
  response.render("states.html");
}
function goHome(request, response) {
  response.redirect("/");
}

function goState(request, response) {
  var selectedState = request.param("state"),
      vars = {};
  gotv.getEarlyVotingLocations(function(error, data) {
    if (error) {
      winston.error(error);
    } else {
      vars.data = data;
    }
    response.render("state_details.html",vars);
  });
}






function earlyVotingLocations(request, response) {
  var selectedState = request.param("state");
  gotv.getConfig(function(error, config) {
    gotv.getEarlyVotingLocations(selectedState, function(error, message) {
      var vars = {};
      if (error) {
        winston.error(error);
      } else {
        
        var states = config.config.earlyVote.state;
        var l = states.length;
        var stateObjs = [];
        for (var i = 0; i < l; i++) {
          var val = states[i];
          var selected = (selectedState == val) ? true : false;
          var obj = {value:val,selected:selected};
          stateObjs.push(obj);
        }
        
        vars = {
          breadcrumbs:[
            {
              url:"/",
              title:"home",
              divider:" > "
            },
            {
              title:"early voting",
              divider:" :: "
            },
            {
              title:selectedState,
              dropdown:true,
              state:stateObjs
            }
          ]
        };
        vars.locations = message;
        vars.config = config.config;
        vars.selectedState = selectedState;
      }
      response.render("early_voting_list.html", vars);
    });
  });
}

function earlyVotingLocationView(request, response) {
  var selectedState = request.param("state"),
      location = request.param("location_id"),
      vars = {};
  
  gotv.getEarlyVotingLocationById(location, function (error, message) {
    if (error) {
      winston.error(error);
    } else {
      vars = {
        breadcrumbs:[
          {
            url:"/",
            title:"home",
            divider:" > "
          },
          {
            url:"/early-voting/"+selectedState,
            title:"early voting :: " + selectedState,
            divider:" > "
          },
          {
            title:location
          }
        ]
      };
      
      vars.selectedState = selectedState;
      vars.location = message;
    }
    response.render("early_voting_place.html", vars);
  });
}

function updateEarlyVotingLocation(request, response) {
  response.redirect("/");
}

function sendEarlyVotingLocationDetails(request, response) {
  var location = request.param("location"),
      email = request.param("email");
  
  gotv.sendEarlyVotingLocationDetails(email, location, function (error, message) {
    if (error || message == "failed") {
      response.json({results:"failed"});
    } else {
      response.json({results:"success"});
    }
  });
}


function doLogin(request, response) {
  helper.renderHTML(response, "");
}
function tryLogin(request, response) {
  
}


function AppController() {}
AppController.prototype.home = home;
AppController.prototype.goHome = goHome;
AppController.prototype.goState = goState;
AppController.prototype.earlyVotingLocations = earlyVotingLocations;
AppController.prototype.earlyVotingLocationView = earlyVotingLocationView;
AppController.prototype.updateEarlyVotingLocation = updateEarlyVotingLocation;
AppController.prototype.sendEarlyVotingLocationDetails = sendEarlyVotingLocationDetails;


AppController.prototype.doLogin = doLogin;
AppController.prototype.tryLogin = tryLogin;

module.exports = new AppController();