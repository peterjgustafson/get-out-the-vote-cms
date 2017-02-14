var logger = require("winston"),
    gotv = require("../services/gotv.js"),
    helper = require("../_helper.js"),
    fs = require("fs"),
    csv = require("fast-csv");

function getCountiesByState(request, response) {
  var state = request.param("state"),
      vars = {};
  vars.stateId = state;
  
  gotv.getCountiesByState(state, function (error, data) {
    if (error) {
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.counties = data.COUNTIES;
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "counties.html", vars);
  });
}
function getCountyById(request, response) {
  var state = request.param("state"),
      county = request.param("county"),
      vars = {};
  vars.stateId = state;
  
  gotv.getCountyById(county, function(error, data) {
    if (error) {
      vars.countyId = county;
      vars.stateId = state;
      vars.message = {message:error.error,type:"error"};
      helper.addSavedMessages(request, response, vars);
      helper.renderHTML(response, "county_details.html", vars);
    } else {
      vars.county = data.COUNTY[0];
      if (vars.county.ABMailToMunicipality == 1) {
        gotv.getMunicipalitiesByCountyId(county, function(error2, data2) {
          if (error2) {
            vars.message = {message:error2.error,type:"error"};
          } else {
            vars.municipalities = data2.MUNICIPALITIES;
          }
          vars.countyId = county;
          //vars.stateId = state;
          helper.addSavedMessages(request, response, vars);
          helper.renderHTML(response, "municipalities.html", vars);
        });
      } else {
        vars.countyId = county;
        //vars.stateId = state;
        
        helper.addSavedMessages(request,response,vars);
        helper.renderHTML(response, "county_details.html", vars);
      }
    }
  });
}
function updateCounty(request, response) {
  var State = request.param("State"),
      City = request.param("City"),
      ZipCode = request.param("ZipCode"),
      Address1 = request.param("Address1"),
      Address2 = request.param("Address2"),
      EmailAddress = request.param("EmailAddress"),
      ClerkFullName = request.param("ClerkFullName"),
      OfficialOfficeName = request.param("OfficialOfficeName"),
      ClerkPhone = request.param("ClerkPhone"),
      ClerkFax = request.param("ClerkFax"),
      CountyId = request.param("county"),
      RegAddress1 = request.param("RegAddress1"),
      RegAddress2 = request.param("RegAddress2"),
      RegCity = request.param("RegCity"),
      RegZip = request.param("RegZip"),
      RegEmailAddress = request.param("RegEmailAddress"),
      details = {},
      vars = {};
  details.State = State;
  details.OfficialOfficeName = OfficialOfficeName;
  details.ClerkFullName = ClerkFullName;
  details.ClerkPhone = ClerkPhone;
  details.ClerkFax = ClerkFax;
  details.ClerkAddress1 = Address1;
  details.ClerkAddress2 = Address2;
  details.ClerkCity = City;
  details.ClerkZip = ZipCode;
  details.ClerkEmailAddress = EmailAddress;
  details.CountyId = CountyId;
  details.RegAddress1 = RegAddress1;
  details.RegAddress2 = RegAddress2;
  details.RegCity = RegCity;
  details.RegZip = RegZip;
  details.RegEmailAddress = RegEmailAddress;
  
  vars.stateId = State;
  
  gotv.updateCounty(details, CountyId, function(error, data) {
    if (error) {
      vars.county = details;
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.county = data.COUNTY[0];
      vars.message = {message:"County details saved",type:"success"};
      response.cookie("message",vars.message);
      
      response.redirect("/"+vars.stateId+"/county/"+vars.county.CountyId);
      return;
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "county_details.html", vars);
  });
}

function bulkUpdateForm(request, response) {
  var stateId = request.param("state"),
      vars = {};
  
  vars.stateId = stateId;
  
  helper.renderHTML(response, "countybulkupload.html", vars);
}

function bulkUpdateProcess(request, response) {
  var state = request.param("state"),
      count = 0,
      counties = [],
      upload_success = 0,
      upload_fail = 0,
      errors = [],
      vars = {};
  
  gotv.getCountiesByState(state, function (error, countyData) {
    
    var countyList = countyData.COUNTIES;
    
    fs.readFile(request.files.counties.path, function (err, data1) {
      var newPath = __dirname + "/../../uploads/uploadedCounties.csv";
      fs.writeFile(newPath, data1, function (err) {
        if (err) {
          logger.error(err);
        } else {
          csv
           .fromPath(newPath)
           .on("record", function(data){
             
             var countyName = data[0];
             var countyId = null;
             for (var i = 0; i < countyList.length; i++) {
               var curr = countyList[i];
               if (countyName.toLowerCase().trim() == curr.CountyName.toLowerCase().trim()) {
                 countyId = curr.CountyId;
                 break;
               }
             }
             count++;
             if (countyId != null) {
               var c = {};
               c.State = state;
               c.CountyId = countyId;
               c.ClerkFullName = data[1].substr(0,100);
               c.OfficialOfficeName = data[2];
               c.ClerkPhone = data[3];
               c.ClerkFax = data[4];
               c.ClerkEmailAddress = data[5];
               c.ClerkAddress1 = data[6];
               c.ClerkAddress2 = data[7];
               c.ClerkCity = data[8];
               c.ClerkZip = data[9];
               c.RegEmailAddress = "";
               c.RegAddress1 = "";
               c.RegAddress2 = "";
               c.RegCity = "";
               c.RegZip = "";
               c.CountyName = countyName;
               counties.push(c);
             } else {
               var tmp = {};
               tmp.County = {};
               tmp.County.CountyName = data[0];
               tmp.County.Error = "County ID not found!";
               upload_fail++;
               errors.push(tmp);
             }
           })
           .on("end", function(){
             logger.debug("done parsing counties");
             logger.debug("counties: " + count);

             var l = counties.length;
             
             if (l == 0) {
               vars.stateId = state;
               vars.counties_parsed = count;
               vars.errors = upload_fail;
               vars.successes = 0;
               vars.error_objs = errors;
               helper.renderHTML(response, "countybulkuploaddone.html", vars);
             } else {
             
               for (var i = 0; i < l; i++) {
                 var cty = counties[i];
                 gotv.updateCounty(cty, cty.CountyId, function(error, data) {
                   logger.debug('bulk item done (county)');
                   
                   if (error) {
                     logger.error(error);
                     var tmp = {};
                     tmp.County = {};
                     tmp.County.Error = JSON.stringify(error);
                     errors.push(tmp);
                     upload_fail++;
                   } else {
                     upload_success++;
                   }
                   if (upload_fail+upload_success == count) {
                     vars.stateId = state;
                     vars.counties_parsed = count;
                     vars.errors = upload_fail;
                     vars.successes = upload_success;
                     if (errors.length > 0) {
                       vars.error_objs = errors;
                     }
                     helper.renderHTML(response, "countybulkuploaddone.html", vars);
                   }
                });
               }
             }
          });
        }
      });
    });
    
  
  });
}


function CountyController() {}
CountyController.prototype.getCountiesByState = getCountiesByState;
CountyController.prototype.getCountyById = getCountyById;
CountyController.prototype.updateCounty = updateCounty;
CountyController.prototype.bulkUpdateForm = bulkUpdateForm;
CountyController.prototype.bulkUpdateProcess = bulkUpdateProcess;
module.exports = new CountyController();