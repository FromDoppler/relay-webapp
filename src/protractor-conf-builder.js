module.exports = {
  getDefaults: getConfigurationDefaults,
  getCapability: getCapability
};

function getConfigurationDefaults() {
  return {
    specs: ['spec/*.js'],
    baseUrl: 'http://localhost:3000',
    jasmineNodeOpts: {
      showColors: true,
      isVerbose: true,
      realtimeFailure: true,
      includeStackTrace: true,
      defaultTimeoutInterval: 30000
    },
    onPrepare: function() {
      onPrepare();
      return browser.getCapabilities().then(function(capabilities) {
        browser.browserName = capabilities.browserName;
        browser.platformName = capabilities.platform;
        browser.browserVersion = capabilities.version;
      });
    }
  };
}

function getCapability(options) {
  var capability = extend(defaultsForCapability, options);

  var nameParts = [];
  nameParts.push('relay-webapp build');
  nameParts.push(process.env.TRAVIS_BUILD_NUMBER);
  nameParts.push(options.testExtraDescriptor);
  nameParts.push(options.browserName);
  nameParts.push(options.version);
  
  capability.name =  nameParts.join(' ').trim();
  return capability;
}

function copyOwnProperties(dst, src) {
  for (var prop in src) {
    if (src.hasOwnProperty(prop)) {
      dst[prop] = src[prop];
    }
  }
}

function extend(baseObject, newProperties) {
  var extendedObject = {};
  copyOwnProperties(extendedObject, baseObject);
  copyOwnProperties(extendedObject, newProperties);
  return extendedObject;
}

var defaultsForCapability = {
  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  build: process.env.TRAVIS_BUILD_NUMBER,
  shardTestFiles: false,
  maxInstances: 5,
  seleniumVersion: '2.46.0'
};

function onPrepare() {
  // TODO: We have to do this because in SauceLabs the screen size is not working correctly.
  browser.driver.manage().window().maximize();
  browser.addMockModule('commonModule', () => angular
    .module('commonModule', ['ngMockE2E'])
    .run(($httpBackend, jwtHelper, auth) => {

      // To allow to load partial views
      $httpBackend.whenGET(/(\.htm|\.html)$/).passThrough();

      // To not pay attention to token expiration date
      jwtHelper.isTokenExpired = () => false;

      // To start the tests without an authenticated session
      auth.logOut();
    }));
}