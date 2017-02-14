module.exports = {
  application: {
    logging: {
      level: "debug"
    },
    analytics: {
      newrelic: {
        app: "tvgotv-cms-dev",
        key: "42a695a8f86655b2aa57fb4851cbf8478aee5fea",
        loglevel: "trace"
      }
    }
  },
  services: {
    api: {
      hostname: "api-dev.targetedgotv.com",
      port: 8080,
      path: "/rest/GOTV",
      ssl: false,
      username: "5C407977-6545-4507-B38D-0FACA482DCAD",
      password: "A4FD2A68-D17E-4596-B024-BDDEF95AEA1C"
    }
  }
};