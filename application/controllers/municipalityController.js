var logger = require("winston"),
    gotv = require("../services/gotv.js"),
    helper = require("../_helper.js"),
    fs = require("fs"),
    csv = require("fast-csv");

function newMunicipality(request, response) {
  var state = request.param("state"),
      county = request.param("county"),
      vars = {};
  
  vars.StateFull = state;
  vars.CountyId = county;
  vars.stateId = state;
  vars.countyId = county;
  vars.State = state;
  
  helper.addSavedMessages(request, response, vars);
  helper.renderHTML(response, "new_municipality.html", vars);
}

function getMunicipalityById(request, response) {
  var state = request.param("state"),
      county = request.param("county"),
      municipality = request.param("municipality"),
      vars = {};
  vars.stateId = state;
  vars.countyId = county;
  
  gotv.getMunicipalityById(municipality, function(error, data) {
    if (error) {
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.municipality = data.MUNICIPALITY[0];
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "municipality_details.html", vars);
  });
}

function addMunicipality(request, response) {
  var state = request.param("state"),
      countyId = request.param("county"),
      obj = parseInputObject(request),
      vars = {};
  obj.State = state;
  obj.CountyId = countyId;
  gotv.addMunicipality(obj, function(error, data) {
    if (error) {
      vars.message = {message:error.error,type:"error"};
      vars.municipality = obj;
      vars.countyId = countyId;
      vars.stateId = state;
      helper.renderHTML(response, "new_municipality.html", vars);
    } else {
      vars.municipality = data.MUNICIPALITY[0];
      vars.countyId = countyId;
      vars.stateId = state;
      response.redirect("/"+vars.stateId+"/counties/"+vars.countyId+"/municipalities/"+vars.municipality.MunicipalityId);
    }
  });
}

function updateMunicipality(request, response) {
  var state = request.param("state"),
      countyId = request.param("county"),
      municipalityId = request.param("municipality"),
      data = parseInputObject(request),
      vars = {};
  data.State = state;
  data.CountyId = countyId;
  data.MunicipalityId = municipalityId;
  gotv.updateMunicipality(data, function(error, data) {
    if (error) {
      vars.message = {message:error.error,type:"error"};
      vars.municipality = data;
      vars.stateId = state;
      vars.countyId = countyId;
    } else {
      vars.message = {message:"Municipality updated successfully",type:"success"};
      vars.municipality = data.MUNICIPALITY[0];
      vars.stateId = state;
      vars.countyId = countyId;
      
      response.cookie("message", vars.message);
      response.redirect("/"+vars.stateId+"/counties/"+vars.countyId+"/municipalities/"+vars.municipality.MunicipalityId);
      return;
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "municipality_details.html", vars);
  });
}

function bulkUploadForm(request, response) {
  var stateId = request.param("state"),
      countyId = request.param("county"),
      vars = {};
  
  vars.stateId = stateId;
  vars.countyId = countyId;
  
  helper.renderHTML(response, "munibulkupload.html", vars);
}

function bulkUploadProcess(request, response) {
  var state = request.param("state"),
      county = request.param("county"),
      municipality_count = 0,
      upload_success = 0,
      upload_fail = 0,
      municipalities = [],
      errors = [],
      successes = [];
  fs.readFile(request.files.municipalities.path, function (err, data1) {
    var newPath = __dirname + "/../../uploads/uploadedFileName2.csv";
    fs.writeFile(newPath, data1, function (err) {
      if (err) {
        logger.error(err);
      } else {
        csv
         .fromPath(newPath)
         .on("record", function(data){
           var muni = {};
           muni.State = state;
           muni.CountyId = county;
           muni.MunicipalityName = data[0];
           muni.ClerkFullName = data[1];
           muni.OfficialOfficeName = data[2];
           muni.Phone = data[3];
           muni.Fax = data[4];
           muni.ABEmailAddress = data[5];
           muni.ABAddress1 = data[6];
           muni.ABAddress2 = data[7];
           muni.ABCity = data[8];
           muni.ABZip = data[9];
           muni.RegEmailAddress = "";
           muni.RegAddress1 = "";
           muni.RegAddress2 = "";
           muni.RegCity = "";
           muni.RegZip = "";
           
           if (muni.MunicipalityName == "") {
           } else {
            municipality_count++;
            municipalities.push(muni);
           }
         })
         .on("end", function(){
           logger.debug("done parsing municipalities");
           logger.debug("municipalities: " + municipality_count);
           
           var l = municipalities.length;
           for (var i = 0; i < l; i++) {
             logger.debug(municipalities[i]);
            gotv.addMunicipality(municipalities[i], function(error, data) {
              logger.debug('bulk item done (municipality)');
              if (error) {
                logger.error(error);
                errors.push(error);
                upload_fail++;
              } else {
                successes.push(data);
                upload_success++;
              }
              if (upload_fail+upload_success == municipality_count) {
                var vars = {};
                vars.stateId = state;
                vars.countyId = county;
                vars.municipalities_parsed = municipality_count;
                vars.errors = upload_fail;
                vars.successes = upload_success;
                helper.renderHTML(response, "munibulkuploaddone.html", vars);
              }
            });
           }
         });
      }
    });
  });
}

function MunicipalityController() {}
MunicipalityController.prototype.newMunicipality = newMunicipality;
MunicipalityController.prototype.getMunicipalityById = getMunicipalityById;
MunicipalityController.prototype.addMunicipality = addMunicipality;
MunicipalityController.prototype.updateMunicipality = updateMunicipality;
MunicipalityController.prototype.bulkUploadForm = bulkUploadForm;
MunicipalityController.prototype.bulkUploadProcess = bulkUploadProcess;
module.exports = new MunicipalityController();

function parseInputObject(request) {
  var ClerkFullName = request.param("ClerkFullName"),
      Address1 = request.param("Address1"),
      Address2 = request.param("Address2"),
      City = request.param("City"),
      Zip = request.param("Zip"),
      EmailAddress = request.param("EmailAddress"),
      RegAddress1 = request.param("RegAddress1"),
      RegAddress2 = request.param("RegAddress2"),
      RegCity = request.param("RegCity"),
      RegZip = request.param("RegZip"),
      RegEmailAddress = request.param("RegEmailAddress"),
      MunicipalityName = request.param("MunicipalityName"),
      OfficialOfficeName = request.param("OfficialOfficeName"),
      Phone = request.param("Phone"),
      Fax = request.param("Fax"),
      data = {};
  
  data.MunicipalityName = MunicipalityName;
  data.OfficialOfficeName = OfficialOfficeName;
  data.Phone = Phone;
  data.Fax = Fax;
  data.ClerkFullName = ClerkFullName;
  data.ABAddress1 = Address1;
  data.ABAddress2 = Address2;
  data.ABCity = City;
  data.ABZip = Zip;
  data.ABEmailAddress = EmailAddress;
  data.RegAddress1 = RegAddress1;
  data.RegAddress2 = RegAddress2;
  data.RegCity = RegCity;
  data.RegZip = RegZip;
  data.RegEmailAddress = RegEmailAddress;
  return data;
}