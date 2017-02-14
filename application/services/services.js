var requests = require("request"),
    logger = require("winston"),
    helper = require("../_helper");

function doGet(url, callback, errorString) {
  errorString = (typeof errorString === 'undefined') ? "Services unavailable" : errorString;
  var opts = {};
  opts.url = url;
  opts.headers = {
    'username':helper.USERNAME,
    'password':helper.PASSWORD
  }
  requests.get(opts, function(error, body, response) {
    logger.debug(response);
    if (error) {
      logger.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      logger.error(error);
      callback(error, null);
    } else {
      logger.debug(response);
      if (body.statusCode !== 200) {
        logger.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        callback({error:errorString}, null);
      } else {
        try {
          callback(error, JSON.parse(response));
        } catch (e) {
          // not a JSON response
          callback(e, response);
        }
      }
    }
  });
}

function doPost(url, vars, callback, errorString) {
  errorString = (typeof errorString === 'undefined') ? "Services unavailable" : errorString;
  vars.headers = {
    'username':helper.USERNAME,
    'password':helper.PASSWORD
  }
  requests.post(url, vars, function (error, body, response) {
    if (error) {
      logger.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      logger.error(error);
      callback(error, response);
    } else {
      logger.debug(response);
      if (body.statusCode !== 200) {
        logger.error(body.statusCode + " response returned");
        error = {error:errorString};
      }
      callback(error, response);
    }
  });
}

function doPut(url, vars, callback, errorString) {
  errorString = (typeof errorString === 'undefined') ? "Services unavailable" : errorString;
  var opts = {};
  opts.method = "PUT";
  opts.url = url;
  opts.body = vars;
  opts.headers = {
    'username':helper.USERNAME,
    'password':helper.PASSWORD
  };
  requests(opts, function (error, body, response) {
    if (error) {
      logger.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      logger.error(error);
      callback(error, null);
    } else {
      var resp = response;
      logger.debug(resp);
      if (body.statusCode !== 200) {
        error = {error:errorString};
        logger.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      }

      try {
        resp = JSON.parse(response);
        if (resp.ERRORMESSAGE || resp.ERRORMSG) {
          logger.error(resp);
          logger.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
          error = {error:errorString};
        }
      } catch (e) {
        error = {error:errorString};
      }
      callback(error, resp);
    }
  });
}

function doDel(url, callback, errorString) {
  errorString = (typeof errorString === 'undefined') ? "Services unavailable" : errorString;
  var opts = {};
  opts.method = "DELETE";
  opts.url = url;
  opts.headers = {
    'username':helper.USERNAME,
    'password':helper.PASSWORD
  };
  requests(opts, function (error, body, response) {
    if (error) {
      logger.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      logger.error(error);
      callback(error, null);
    } else {
      var resp = response;
      logger.debug(response);
      if (body.statusCode !== 200) {
        error = {error:errorString};
        logger.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      }
      try {
        resp = JSON.parse(response);
        if (resp.ERRORMESSAGE || resp.ERRORMSG) {
          logger.error(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
          error = {error:errorString};
        }
      } catch (e) {
        error = {error:errorString};
      }
      callback(error, resp);
    }
  });
}


function Services() {}
Services.prototype.get = doGet;
Services.prototype.post = doPost;
Services.prototype.put = doPut;
Services.prototype.del = doDel;
module.exports = new Services();