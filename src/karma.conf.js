module.exports = function (config) {
  var configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // When you update it, please remember to edit index.html and gulpfile.js
      // TODO: remove this duplicated code
      __dirname + '/wwwroot/lib/angular/angular.js',
      __dirname + '/wwwroot/lib/angular-sanitize/angular-sanitize.js',
      __dirname + '/wwwroot/lib/angular-route/angular-route.js',
      __dirname + '/wwwroot/lib/angular-translate/angular-translate.js',
      __dirname + '/wwwroot/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      __dirname + '/wwwroot/lib/angular-animate/angular-animate.js',
      __dirname + '/wwwroot/lib/angular-jwt/dist/angular-jwt.js',
      __dirname + '/wwwroot/lib/angular-modal-service/dst/angular-modal-service.min.js',
      __dirname + '/wwwroot/lib/angular-mocks/angular-mocks.js',
      __dirname + '/wwwroot/lib/d3/d3.min.js',
      __dirname + '/wwwroot/lib/c3/c3.min.js',
      __dirname + '/wwwroot/lib/angular-click-outside/clickoutside.directive.js',
      __dirname + '/wwwroot/lib/jquery/dist/jquery.min.js',
      __dirname + '/wwwroot/lib/moment/min/moment.min.js',
      __dirname + '/wwwroot/lib/angular-moment/angular-moment.js',
      __dirname + '/wwwroot/lib/bootstrap-daterangepicker/daterangepicker.js',
      __dirname + '/wwwroot/lib/angular-daterangepicker/js/angular-daterangepicker.min.js',
      __dirname + '/wwwroot/lib/angular-scroll/angular-scroll.min.js',
      __dirname + '/wwwroot/lib/angular-ui-select/dist/select.min.js',
      __dirname + '/wwwroot/lib/angular-ui-mask/dist/mask.min.js',
      __dirname + '/wwwroot/lib/angular-slugify/angular-slugify.js',
      __dirname + '/wwwroot/lib/angular-tooltips/dist/angular-tooltips.min.js',
      __dirname + '/wwwroot/lib/angularjs-slider/dist/rzslider.min.js',
      __dirname + '/wwwroot/lib//angular-recaptcha/release/angular-recaptcha.min.js',
      __dirname + '/wwwroot/locales/en-translation.js',
      __dirname + '/wwwroot/locales/es-translation.js',
      __dirname + '/wwwroot/polyfills/array.prototype.filter.js',
      __dirname + '/wwwroot/polyfills/array.prototype.find.js',
      __dirname + '/wwwroot/polyfills/array.prototype.map.js',
      __dirname + '/wwwroot/polyfills/array.prototype.reduce.js',
      __dirname + '/wwwroot/app.js',
      __dirname + '/wwwroot/constants.js',
      __dirname + '/wwwroot/controllers/LoginCtrl.js',
      __dirname + '/wwwroot/controllers/MainCtrl.js',
      __dirname + '/wwwroot/controllers/DashboardCtrl.js',
      __dirname + '/wwwroot/controllers/TemplateCtrl.js',
      __dirname + '/wwwroot/controllers/TemplatesCtrl.js',
      __dirname + '/wwwroot/controllers/ReportsCtrl.js',
      __dirname + '/wwwroot/controllers/DownloadsCtrl.js',
      __dirname + '/wwwroot/controllers/HeaderCtrl.js',
      __dirname + '/wwwroot/controllers/ConfirmationCtrl.js',
      __dirname + '/wwwroot/controllers/ResetPasswordCtrl.js',
      __dirname + '/wwwroot/controllers/modals/WelcomeCtrl.js',
      __dirname + '/wwwroot/controllers/modals/ErrorCtrl.js',
      __dirname + '/wwwroot/controllers/modals/GeneralTemplateCtrl.js',
      __dirname + '/wwwroot/controllers/SettingsCtrl.js',
      __dirname + '/wwwroot/controllers/RegistrationCtrl.js',
      __dirname + '/wwwroot/controllers/BillingCtrl.js',
      __dirname + '/wwwroot/interceptors/errorHandlerInterceptor.js',
      __dirname + '/wwwroot/directives/c3chart.js',
      __dirname + '/wwwroot/directives/dropdown.js',
      __dirname + '/wwwroot/directives/enter.js',
      __dirname + '/wwwroot/directives/spinner.js',
      __dirname + '/wwwroot/directives/validation-errors.js',
      __dirname + '/wwwroot/directives/validation-errors-fluid.js',
      __dirname + '/wwwroot/directives/email-format-validation.js',
      __dirname + '/wwwroot/filters/numberFormat.js',
      __dirname + '/wwwroot/services/auth.js',
      __dirname + '/wwwroot/services/linkUtilities.js',
      __dirname + '/wwwroot/services/reports.js',
      __dirname + '/wwwroot/services/templates.js',
      __dirname + '/wwwroot/services/signup.js',
      __dirname + '/wwwroot/services/utils.js',
      __dirname + '/wwwroot/services/settings.js',
	  __dirname + '/wwwroot/services/resources.js',
      __dirname + '/wwwroot/env/development.js',
      __dirname + '/wwwroot/lib/svgxuse/svgxuse.js',
      __dirname + '/wwwroot/lib/autofill-directive/autofill-directive.js',
      __dirname + '/wwwroot/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [
      __dirname + '/wwwroot/lib/**/*.spec.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {

    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 3001,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher

    browsers: [
      // 'PhantomJS', // It does not work yet, see https://github.com/ariya/phantomjs/issues/14506#issuecomment-251611067
      'Chrome'
    ],

    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
