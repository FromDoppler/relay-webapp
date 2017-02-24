var configBuilder = require('./protractor-conf-builder');

var config = configBuilder.getDefaults();
config.multiCapabilities = [
    configBuilder.getCapability({ browserName: 'chrome' })
];

exports.config = config;