exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  specs: ['spec/*.js'],
  baseUrl: 'http://localhost:3000',
  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    realtimeFailure: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  },
  multiCapabilities: [{
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
    name: 'relay-webapp Chrome build ' + process.env.TRAVIS_BUILD_NUMBER,
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 5,
    seleniumVersion: '2.46.0'
  }],
  onPrepare: "./spec/onPrepare.js"
};
