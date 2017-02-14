module.exports = {
  application: {
    logging: {
      level: "debug"
    },
    analytics: {
      newrelic: {
        app: "tvgotv-cms-demo",
        key: "42a695a8f86655b2aa57fb4851cbf8478aee5fea",
        loglevel: "trace"
      }
    }
  },
  services: {
    api: {
      hostname: "api-demo.targetedgotv.com",
      port: 8080,
      path: "/rest/GOTV",
      ssl: false,
      username: "1606016A-5C6E-4EE0-8E85-2E0A8E310B1A",
      password: "E4D97AAA-4761-42D0-9A5F-7A110267A27D"
    }
  }
};