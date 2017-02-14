var assert = require("assert"),
    gotv = require("../application/services/gotv"),
    should = require("chai").should();
    

describe("GOTV", function() {
  
  describe(".getElections", function() {
    it("should succeed", function(done) {
      gotv.getElections(function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');;
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getElectionsByState", function() {
    it('should succeed if given a state', function(done) {
      gotv.getElectionsByState('WI', function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getElectionById", function() {
    it('should succeed if given an id', function(done) {
      gotv.getElectionById(5000, function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an("object");
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".addElection", function() {
    it('should add a new election and not return an error');
//    it('should not return an error', function(done) {
//      var data = {};
//      data.State = "AR";
//      data.ElectionName = "UNIT TEST";
//      data.ElectionDate = "11/11/2014";
//      data.RegistrationEndDate = "11/11/2014";
//      data.EVStartDate = "11/11/2014";
//      data.EVEndDate = "11/11/2014";
//      data.ABStartDate = "11/11/2014";
//      data.ABEndDate = "11/11/2014";
//      data.ABEmailAddress = "email@email.com";
//      data.ABRequestPDFPath = "test.pdf";
//      gotv.addElection(data, function(error, response) {
//        try {
//          should.not.exist(error);
//          should.exist(response);
//          done();
//        } catch (e) {
//          done(e);
//        }
//      });
//    });
  });
  
  describe(".updateElection", function() {
    it('should not return an error', function(done) {
      var ElectionId = 5009,
          data = {};
      data.State = "AL";
      data.ElectionName = "Alabama Test";
      data.ElectionDate = "11/11/2014";
      data.RegistrationEndDate = "10/07/2014";
      data.EVStartDate = "10/07/2014";
      data.EVEndDate = "11/11/2014";
      data.ABStartDate = "10/07/2014";
      data.ABEndDate = "11/11/2014";
      data.ABEmailAddress = "email@email.com"
      data.ABRequestPDFPath = "test.pdf";
      gotv.updateElection(data, ElectionId, function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an("object");
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getEVLocationsByState", function() {
    it('should not return an error', function(done) {
      gotv.getEVLocationsByState("TX", function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an("object");
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getEVLocationById", function() {
    it('should not return an error', function(done) {
      gotv.getEVLocationById(1, function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an("object");
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".addEVLocation", function() {
    it('should not return error');
//    it('should not return an error', function(done) {
//      var data = {};
//      data.county = "Benton";
//      data.locationName = "Centerton Fire Department UNIT TEST";
//      data.address1 = "W Centerton Blvd";
//      data.address2 = "";
//      data.city = "Centerton";
//      data.state = "AR";
//      data.ZipCode = "72719";
//      data.Latitude = 2.000001;
//      data.Longitude = 1.000001;
//      data.phone = "";
//      data.LocationDetails = "";
//      data.defaultZoomLevel = "15";
//      gotv.addEVLocation(data, function(error, response) {
//        console.log(error);
//        console.log(response);
//        try {
//          should.not.exist(error);
//          should.exist(response);
//          done();
//        } catch (e) {
//          done(e);
//        }
//      });
//    });
  });
  
  describe(".updateEVLocation", function() {
    it('should not return an error');
//    it('should not return an error', function(done) {
//      var data = {};
//      data.locationId = 867;
//      data.county = "Benton";
//      data.locationName = "Centerton Fire Department UNIT TEST";
//      data.address1 = "W Centerton Blvd";
//      data.address2 = "";
//      data.city = "Centerton";
//      data.state = "AR";
//      data.ZipCode = "72719";
//      data.Latitude = 2.000001;
//      data.Longitude = 1.000001;
//      data.phone = "";
//      data.LocationDetails = "";
//      data.defaultZoomLevel = "15";
//      gotv.updateEVLocation(data, function(error, response) {
//        try {
//          should.not.exist(error);
//          should.exist(response);
//          done();
//        } catch (e) {
//          done(e);
//        }
//      });
//    });
  });
  
  describe(".getStates", function() {
    it('should get a list of states and not return an error', function(done) {
      gotv.getStates(function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getStateById", function() {
    it('should get a state by the given id and not return an error', function(done) {
      gotv.getStateById('AR', function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getCountiesByState", function() {
    it('should not return an error', function(done) {
      gotv.getCountiesByState('TX', function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getCountyById", function() {
    it('should not return an error', function(done) {
      gotv.getCountyById(1, function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  
  describe(".updateCounty", function() {
    it('should not return an error');
  });
  
  describe(".getMunicipalitiesByCountyId", function() {
    it('should not return an error', function(done) {
      gotv.getMunicipalitiesByCountyId('48453', function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getMunicipalityById", function() {
    it('should not return an error', function(done) {
      gotv.getMunicipalityById('10000', function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".updateMunicipality", function() {
    it('should not return an error');
  });
    
  describe(".getClients", function() {
    it('should get a list of clients', function(done) {
      gotv.getClients(function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getClientById", function() {
    it('should get a client by id', function(done) {
      gotv.getClientById(1, function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
    
describe(".getDomainsByClient", function() {
    it('should get a client by id', function(done) {
      gotv.getDomainsByClient(1, function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getVoterFile", function() {
    it('should get voter file information', function(done) {
      gotv.getVoterFile(function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
  describe(".getVoterFileByClientId", function() {
    it('should get voter file information', function(done) {
      gotv.getVoterFileByClientId(2, function(error, response) {
        try {
          console.log(error);
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  
});