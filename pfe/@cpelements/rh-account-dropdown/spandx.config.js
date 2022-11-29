module.exports = {
  host: {
    local: "local.foo.redhat.com",
    qa: "qa.foo.redhat.com",
    dev: "dev.foo.redhat.com",
    stage: "stage.foo.redhat.com",
    prod: "prod.foo.redhat.com",
    devApi: "api.dev.foo.redhat.com",
    qaApi: "api.qa.foo.redhat.com",
    stageApi: "api.stage.foo.redhat.com",
    prodApi: "api.prod.foo.redhat.com",
    ssoProd: "sso.redhat.com",
  },
  proxy: {
    host: "http://squid.corp.redhat.com:3128",
    pattern: "^https://(.*?).redhat.com",
  },
  port: 1337,
  verbose: false,
  bs: {
    https: true,
  },
  routes: {
    // "/webassets/avalon/j/includes/ieSVGfix.js": "./thingstuff.js",
    // "/webassets/avalon/j/includes/status-widget.js": "./thingstuff.js",
    // "/webassets/avalon/j/includes/avatars.js": "./thingstuff.js",
    // "": "./thingstuff.js",
    // "": "./thingstuff.js",
    // "": "./thingstuff.js",
    // "": "./thingstuff.js",
    // "": "./thingstuff.js",
    // "": "./thingstuff.js",
    // "": "./thingstuff.js",
    // "": "./thingstuff.js",
    // "": "./thingstuff.js",
    // "": "./thingstuff.js",

    // Access.Redhat.com ONLY
    // "/webassets/avalon/j/data.json": "./data.json",
    "/api": {
      host: "https://access.redhat.com",
    },
    "/sites/default/files": {
      host: "https://access.redhat.com",
    },
    // "/api/assembly": {
    //   host: "https://pantheon.corp.qa.redhat.com"
    // },
    // "/sites/default/files": {
    //   host: "https://access.redhat.com",
    // },
    "/auth/resources/wyf15/account/rhd-theme/@cpelements/rh-account-dropdown/dist":
      "./dist",

    // SSO
    "/auth/resources/wyf15/account/rhd-theme/@cpelements/rh-account-dropdown/dist":
      "./dist",

    "/webassets/avalon/j/public_modules/node_modules/@cpelements/rh-account-dropdown/dist":
      "./dist",

    // Route a URL path to an app server.
    // This is most useful for testing local files (esp JS and CSS) against
    // a remote QA or production server.
    "/": {
      host: {
        local: "http://access.local.redhat.com",
        dev: "https://access.devgssci.devlab.phx1.redhat.com",
        devApi: "https://api.access.devgssci.devlab.phx1.redhat.com",
        qa: "https://access.qa.redhat.com",
        qaApi: "https://api.access.qa.redhat.com",
        stage: "https://access.stage.redhat.com",
        stageApi: "https://api.access.stage.redhat.com",
        prod: "https://access.redhat.com",
        prodApi: "https://api.access.redhat.com",
        ssoProd: "https://sso.foo.redhat.com",
      },
    },
  },
};
