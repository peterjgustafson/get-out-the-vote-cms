var moment = require("moment"),
    config = require("./config/"+(process.env.NODE_ENV || "dev")),
    logger = require("winston"),
    helper;
/**
 * Define some global helpers so we can access them easily anywhere.
 */

helper.mock = false;

helper.USERNAME = config.services.api.username;
helper.PASSWORD = config.services.api.password;
helper.log_level = config.application.logging.level;
helper.base_url = getBaseUrl();

function getBaseUrl() {
  var u = (config.services.api.ssl) ? "https" : "http";
  u = u + "://" + config.services.api.hostname+config.services.api.path;
  return u;
}

helper.elections_url = "/Elections";
helper.locations_url = "/VotingLocations";
helper.states_url = "/States";
helper.counties_url = "/counties";
helper.municipalities_url = "/municipalities";
helper.voters_url = "/Voters/voterFile";
helper.clients_url = "/Clients";
helper.domains_url = "/Domains";

helper.list_url = "/list";

helper.addSavedMessages = function (request, response, vars) {
  if (typeof request.cookies.message !== 'undefined') {
    if (typeof vars.message !== 'undefined') {
      var ms = vars.message;
      vars.message = [ms, request.cookies.message];
    } else {
      vars.message = request.cookies.message;
    }
    response.clearCookie("message");
  }
}

helper.renderHTML = function (response, template, vars) {
  response.render(template, vars, function(error, html) {
    vars.content = html;
    response.render("layout.html", vars);
  });
}


helper.formatDateHelper = function(date) {
  var rtn = "";
  var m = moment(date, "MM\/DD\/YYYY");
  try {
    if (m.isValid()) {
      rtn = m.format("MM/DD/YYYY");
    }
  } catch (e) {
  }
  return rtn;                                          
}

helper.getStateById = function(id) {
  if (a.length == 0) {
    stateArray();
  }
  return a[id];
}

helper.getStateList = function() {
  if (a.length == 0) {
    stateArray();
  }
  
  var objs = [];
  var keys = Object.keys(a);
  for (var i = 0; i < keys.length; i++) {
    objs.push({stateCode:keys[i],stateName:a[keys[i]]});
  }
  return objs;
}

var a = [];
function stateArray() {
  a.AL = "Alabama";
  a.AK = "Alaska";
  a.AZ = "Arizona";
  a.AR = "Arkansas";
  a.CA = "California";
  a.CO = "Colorado";
  a.CT = "Connecticut";
  a.DE = "Deleware";
  a.FL = "Florida";
  a.GA = "Georgia";
  a.HI = "Hawaii";
  a.ID = "Idaho";
  a.IL = "Illinois";
  a.IN = "Indiana";
  a.IA = "Iowa";
  a.KS = "Kansas";
  a.KY = "Kentuky";
  a.LA = "Louisiana";
  a.ME = "Maine";
  a.MD = "Maryland";
  a.MA = "Massachusetts";
  a.MI = "Michigan";
  a.MN = "Minnesota";
  a.MS = "Mississippi";
  a.MO = "Missouri";
  a.MT = "Montana";
  a.NE = "Nebraska";
  a.NV = "Nevada";
  a.NH = "New Hampshire";
  a.NJ = "New Jersey";
  a.NM = "New Mexico";
  a.NY = "New York";
  a.NC = "North Carolina";
  a.ND = "North Dakota";
  a.OH = "Ohio";
  a.OK = "Oklahoma";
  a.OR = "Oregon";
  a.PA = "Pennsylvania";
  a.RI = "Rhode Island";
  a.SC = "South Carolina";
  a.SD = "South Dakota";
  a.TN = "Tennessee";
  a.TX = "Texas";
  a.UT = "Utah";
  a.VT = "Vermont";
  a.VA = "Virginia";
  a.WA = "Washington";
  a.WV = "West Virginia";
  a.WI = "Wisconsin";
  a.WY = "Wyoming";
}

function helper() {
  stateArray();
}

module.exports = helper;