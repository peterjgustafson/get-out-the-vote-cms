var logger = require("winston"),
    gotv = require("../services/gotv.js"),
    helper = require("../_helper.js"),
    fs = require("fs"),
    csv = require("fast-csv");


function getLocationsByState(request, response) {
  var state = request.param("state"),
      vars = {};
  gotv.getEVLocationsByState(state, function (error, data) {
    vars.stateId = state;
    if (error) {
      logger.error(error);
      vars.error = error;
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.locations = data.LOCATIONS;
      logger.debug(vars.locations.length + " Early Vote Locations in " + state);
    }
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "locations.html", vars);
  });
}

function getLocationById(request, response) {
  var state = request.param("state"),
      locationId = request.param("locationId"),
      vars = {};
  gotv.getEVLocationById(locationId, function (error, data) {
    
    vars.stateId = state;
    vars.locationId = locationId;
    
    if (error) {
      logger.error(error);
      vars.error = error;
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.location = data.LOCATION[0];
      var hrs = vars.location.LocationDetails.split("|");
      if (hrs[0]) {
        vars.location.HoursOfOperation1 = hrs[0];
      }
      if (hrs[1]) {
        vars.location.HoursOfOperation2 = hrs[1];
      }
      if (hrs[2]) {
        vars.location.HoursOfOperation3 = hrs[2];
      }
      if (hrs[3]) {
        vars.location.HoursOfOperation4 = hrs[3];
      }
      if (hrs[4]) {
        vars.location.HoursOfOperation5 = hrs[4];
      }
    }
    
    helper.addSavedMessages(request, response, vars);
    helper.renderHTML(response, "location.html", vars);
  });
}

function newLocation(request, response) {
  var state = request.param("state"),
      vars = {},
      loc = {};
  
  vars.stateId = state;
  helper.addSavedMessages(request, response, vars);
  helper.renderHTML(response, "new_location.html", vars);
}

function addLocation(request, response) {
  var State = request.param("state"),
      Address1 = request.param("Address1"),
      Address2 = request.param("Address2"),
      City = request.param("City"),
      ZipCode = request.param("ZipCode"),
      County = request.param("County"),
      Phone = request.param("Phone"),
      Website = request.param("Website"),
      Hours1 = request.param("HoursOfOperation1"),
      Hours2 = request.param("HoursOfOperation2"),
      Hours3 = request.param("HoursOfOperation3"),
      Hours4 = request.param("HoursOfOperation4"),
      Hours5 = request.param("HoursOfOperation5"),
      LocationName = request.param("LocationName"),
      location = {},
      hours = [];
  
  hours.push(Hours1);
  if (typeof Hours2 !== 'undefined' && Hours2.length > 0) {
    hours.push(Hours2);
  }
  if (typeof Hours3 !== 'undefined' && Hours3.length > 0) {
    hours.push(Hours3);
  }
  if (typeof Hours4 !== 'undefined' && Hours4.length > 0) {
    hours.push(Hours4);
  }
  if (typeof Hours5 !== 'undefined' && Hours5.length > 0) {
    hours.push(Hours5);
  }
  
  
  location.locationName = LocationName;
  location.state = State;
  location.address1 = Address1;
  location.address2 = Address2;
  location.city = City;
  location.ZipCode = ZipCode;
  location.county = County;
  location.phone = Phone;
  location.LocationDetails= hours.join("|");
  location.Latitude = 0.00;
  location.Longitude = 0.00;
  location.defaultZoomLevel = 15;
  location.Website = Website;
  
  gotv.addEVLocation(location, function(error, data) {
    var vars = {},
        template = "location.html";
    
    vars.stateId = State;
    if (error) {
      logger.error(error);
      vars.message = {message:error.error,type:"error"};
      location.HoursOfOperation1 = Hours1;
      location.HoursOfOperation2 = Hours2;
      location.HoursOfOperation3 = Hours3;
      location.HoursOfOperation4 = Hours4;
      location.HoursOfOperation5 = Hours5;
      vars.location = location;
      template = "new_location.html";
    } else {
      var tmp = JSON.parse(data);
      vars.location = tmp.LOCATION[0];
      vars.message = {message:"Location added successfully",type:"success"};
      
      var hrs = vars.location.LocationDetails.split("|");
      if (hrs[0]) {
        vars.location.HoursOfOperation1 = hrs[0];
      }
      if (hrs[1]) {
        vars.location.HoursOfOperation2 = hrs[1];
      }
      if (hrs[2]) {
        vars.location.HoursOfOperation3 = hrs[2];
      }
      if (hrs[3]) {
        vars.location.HoursOfOperation4 = hrs[3];
      }
      if (hrs[4]) {
        vars.location.HoursOfOperation5 = hrs[4];
      }
      
      response.cookie("message", vars.message);
      response.redirect("/"+vars.stateId+"/location/"+vars.location.LocationId);
      return;
    }
    helper.renderHTML(response, template, vars);
  });
}

function updateLocation(request, response) {
  var state = request.param("state"),
      locationId = request.param("locationId"),
      locationName = request.param("LocationName"),
      prevAddress1 = request.param("PreviousAddress1"),
      prevAddress2 = request.param("PreviousAddress2"),
      prevCity = request.param("PreviousCity"),
      prevZipCode = request.param("PreviousZipCode"),
      address1 = request.param("Address1"),
      address2 = request.param("Address2"),
      city = request.param("City"),
      zipCode = request.param("ZipCode"),
      county = request.param("County"),
      phoneNumber = request.param("Phone"),
      website = request.param("Website"),
      Hours1 = request.param("HoursOfOperation1"),
      Hours2 = request.param("HoursOfOperation2"),
      Hours3 = request.param("HoursOfOperation3"),
      Hours4 = request.param("HoursOfOperation4"),
      Hours5 = request.param("HoursOfOperation5"),
      lat = request.param("Latitude"),
      lng = request.param("Longitude"),
      data = {},
      hours = [];
  
  hours.push(Hours1);
  if (typeof Hours2 !== 'undefined' && Hours2.length > 0) {
    hours.push(Hours2);
  }
  if (typeof Hours3 !== 'undefined' && Hours3.length > 0) {
    hours.push(Hours3);
  }
  if (typeof Hours4 !== 'undefined' && Hours4.length > 0) {
    hours.push(Hours4);
  }
  if (typeof Hours5 !== 'undefined' && Hours5.length > 0) {
    hours.push(Hours5);
  }
  
  data.state = state;
  data.locationName = locationName;
  data.address1 = address1;
  data.address2 = address2;
  data.City = city;
  data.zipCode = zipCode;
  data.county = county;
  data.phone = phoneNumber;
  data.Website = website;
  data.LocationDetails = hours.join("|");
  data.Latitude = lat;
  data.Longitude = lng;
  
  gotv.updateEVLocation(data, locationId, function(error, data) {
    var vars = {};
    
    if (error) {
      logger.error(error);
      vars.message = {message:error.error,type:"error"};
    } else {
      vars.message = {message:"Location Saved.",type:"success"};
      vars.stateId = state;
      vars.locationId = locationId;
      vars.location = data.LOCATION[0];
      var hrs = vars.location.LocationDetails.split("|");
      if (hrs[0]) {
        vars.location.HoursOfOperation1 = hrs[0];
      }
      if (hrs[1]) {
        vars.location.HoursOfOperation2 = hrs[1];
      }
      if (hrs[2]) {
        vars.location.HoursOfOperation3 = hrs[2];
      }
      if (hrs[3]) {
        vars.location.HoursOfOperation4 = hrs[3];
      }
      if (hrs[4]) {
        vars.location.HoursOfOperation5 = hrs[4];
      }
      response.cookie("message",vars.message);
      response.redirect("/"+vars.stateId+"/location/"+vars.locationId);
      return;
    }
    helper.renderHTML(response, "location.html", vars);
  });
}

function deleteLocation(request, response) {
  var state = request.param("state"),
      locationId = request.param("locationId");
  gotv.deleteEVLocation(locationId, function (error, data) {
    if (error) {
      logger.error(error);
      response.cookie("message",{message:"Error deleting location",type:"error"});
      response.send(500);
    } else {
      response.cookie("message",{message:"Location deleted",type:"success"});
      response.send(200);
    }
  });
}


function bulkUploadForm(request, response) {
  var stateId = request.param("state"),
      vars = {};
  
  vars.stateId = stateId;
  
  helper.renderHTML(response, "bulkupload.html", vars);
}

function bulkUploadProcess(request, response) {
  var state = request.param("state"),
      location_count = 0,
      upload_success = 0,
      upload_fail = 0,
      locations = [],
      errors = [],
      successes = [];
  fs.readFile(request.files.locations.path, function (err, data1) {
    var newPath = __dirname + "/../../uploads/uploadedFileName.csv";
    fs.writeFile(newPath, data1, function (err) {
      if (err) {
        logger.error(err);
      } else {
        csv
         .fromPath(newPath)
         .on("record", function(data){
           var hrs1 = data[7];
           var hrs2 = data[8];
           var hrs3 = data[9];
           var hrs4 = data[10];
           var hrs5 = data[11];
           var Hours = "";
           if (hrs1) {
            Hours += hrs1;
           }
           if (hrs2) {
             Hours += (Hours === "") ? hrs2 : "|"+hrs2;
           }
           if (hrs3) {
             Hours += (Hours === "") ? hrs3 : "|"+hrs3;
           }
           if (hrs4) {
             Hours += (Hours === "") ? hrs4 : "|"+hrs4;
           }
           if (hrs5) {
             Hours += (Hours === "") ? hrs5 : "|"+hrs5;
           }
           var location = {};
           location.locationName = data[1];
           location.state = data[5];
           location.address1 = data[2];
           location.address2 = data[3];
           location.city = data[4];
           location.ZipCode = (data[6].length < 5) ? "0"+data[6] : data[6];
           location.county = data[0];
           location.phone = (typeof data[13] === 'undefined' || data[13].length == 0) ? data[12] : data[13];
           location.LocationDetails= Hours;
           location.Latitude = 0.00;
           location.Longitude = 0.00;
           location.defaultZoomLevel = 15;
           location.Website = data[14];
           
           location_count++;
           locations.push(location);
         })
         .on("end", function(){
           logger.debug("done parsing locations");
           logger.debug("locations: " + location_count);
           
           for (var i = 0; i < location_count; i++) {
             gotv.addEVLocation(locations[i], function(error, body) {
               if (error) {
                upload_fail++;
               } else {
                upload_success++;
               }
              if (upload_fail+upload_success == location_count) {
                var vars = {};
                vars.stateId = state;
                vars.locations_parsed = location_count;
                vars.errors = upload_fail;
                vars.successes = upload_success;
                helper.renderHTML(response, "bulkuploaddone.html", vars);
              }
            });
           }
         });
      }
    });
  });
}

function doLocs(locations, callback) {
  var l = locations.length,
      done = false,
      i = 0,
      errors = [],
      successes = [],
      upload_fail = 0,
      upload_success = 0;
  
  doLoc(locations, function() {
    callback();
  });
}

function doLoc(locs, callback) {
  var loc = locs.pop();
  gotv.addEVLocation(loc, function(error, data) {
    var data = {};
    if (error) {
      bulkDataRes.upload_fail++;
    } else {
      bulkDataRes.upload_success++;
    }
    if (locs.length > 0) {
      doLoc(locs, callback);
    } else {
      callback();
    }
  });
}

function LocationController() {}
LocationController.prototype.getLocationsByState = getLocationsByState;
LocationController.prototype.getLocationById = getLocationById;
LocationController.prototype.newLocation = newLocation;
LocationController.prototype.addLocation = addLocation;
LocationController.prototype.updateLocation = updateLocation;
LocationController.prototype.deleteLocation = deleteLocation;
LocationController.prototype.bulkUploadForm = bulkUploadForm;
LocationController.prototype.bulkUploadProcess = bulkUploadProcess;

module.exports = new LocationController();
    