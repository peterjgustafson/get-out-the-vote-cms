var con = require("./application/config/" + (process.env.NODE_ENV || "dev"));

exports.config = {
  app_name : [con.application.analytics.newrelic.app],
  license_key : con.application.analytics.newrelic.key,
  logging : {
    level : con.application.analytics.newrelic.loglevel
  }
};
