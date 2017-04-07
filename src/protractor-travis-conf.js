var configBuilder = require('./protractor-conf-builder');

var config = configBuilder.getDefaults();
config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;
config.multiCapabilities = [
    configBuilder.getCapability({ browserName: 'chrome', platform: 'Windows 7', screenResolution: '1280x960' })
    /*configBuilder.getCapability({ browserName: 'firefox', platform: 'Windows 7', screenResolution: '1280x960' })*/
];

exports.config = config;