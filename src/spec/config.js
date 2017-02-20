exports.config = {
  framework: 'jasmine',
  specs: ['*_spec.js'],
  baseUrl: 'http://localhost:3000',
  multiCapabilities: [
    // { browserName: 'firefox' }, // By the moment firefox does not work, exception: "org.openqa.selenium.WebDriverException: Firefox option was set, but is not a FirefoxOption"
    { browserName: 'chrome' }
  ],
  onPrepare: "onPrepare.js"
}
