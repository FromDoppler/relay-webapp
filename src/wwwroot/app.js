(function () {
  'use strict';

  var dopplerRelayModule = angular
    .module('dopplerRelay', [
        'ngRoute',
        'ngSanitize',
        'pascalprecht.translate',
        'ngAnimate',
        'angular-jwt',
        'autofill-directive',
        'angularModalService',
        'angular-click-outside',
        'duScroll',
        'angularMoment',
        'daterangepicker'
    ])
    .config(['$routeProvider', '$translateProvider', '$locationProvider', '$httpProvider', 'jwtInterceptorProvider', function ($routeProvider, $translateProvider, $locationProvider, $httpProvider, jwtInterceptorProvider) {

      //  $locationProvider.html5Mode(true); //this apply HTML5MODE

      $routeProvider
        .when('/login', {
          templateUrl: 'partials/login/login.html',
          controller: 'LoginCtrl'
        })
        .when('/dashboard', {
          templateUrl: 'partials/dashboard/dashboard.html',
          controller: 'DashboardCtrl'
        })
        .when('/templates', {
          templateUrl: 'partials/templates/templates.html',
          controller: 'TemplatesCtrl'
        })
        .when('/templates/new', {
          templateUrl: 'partials/templates/template.html',
          controller: 'TemplateCtrl'
        })
        .when('/templates/:templateId', {
          templateUrl: 'partials/templates/template.html',
          controller: 'TemplateCtrl'
        })
        .when('/reports', {
          templateUrl: 'partials/reports/reports.html',
          controller: 'ReportsCtrl'
        })
        .when('/reports/downloads', {
          templateUrl: 'partials/downloads/downloads.html',
          controller: 'DownloadsCtrl'
        })
        .when('/signup/confirmation', {
          templateUrl: 'partials/signup/confirmationPage.html',
          controller: 'ConfirmationCtrl',
          controllerAs: 'vm'
        })
        .when('/signup/error', {
          templateUrl: 'partials/signup/error.html'
        })
        .when('/reset-password', {
          templateUrl: 'partials/resetPassword/resetPassword.html',
          controller: 'ResetPasswordCtrl',
          controllerAs: 'vm'
        })
        .when('/temporal-token-error', {
          templateUrl: 'partials/temporal-token-error.html'
        })
        .when('/settings/connection-settings', {
          templateUrl: 'partials/settings/connection-settings.html',
          controller: 'SettingsCtrl',
          controllerAs: 'vm'
        })
        .when('/settings/domain-manager', {
          templateUrl: 'partials/settings/domain-manager.html',
          controller: 'DomainManagerCtrl',
          controllerAs: 'vm'
        })
        .when('/signup/registration', {
          templateUrl: 'partials/signup/registration.html',
          controller: 'RegistrationCtrl',
          controllerAs: 'vm'
        })
        .otherwise({
          redirectTo: '/reports'
        });

      $translateProvider
        .translations('en', window["relay-translation-en"])
        .translations('es', window["relay-translation-es"])
        .preferredLanguage('en')
        .useSanitizeValueStrategy('sanitizeParameters');

      jwtInterceptorProvider.tokenGetter = ['auth', function (auth) { return auth.getApiToken(); }];

      $httpProvider.interceptors.push('jwtInterceptor');

      $httpProvider.interceptors.push('errorHandlerInterceptor');

    }]);

  dopplerRelayModule.run(['$rootScope', 'auth', '$location', '$translate', 'jwtHelper', function ($rootScope, auth, $location, $translate, jwtHelper) {
    $rootScope.$on('$locationChangeStart', function () {
      var queryParams = $location.search();

      var queryLang = queryParams['lang'];
      if (queryLang) {
        $location.search('lang', null);
        $translate.use(queryLang);
      }

      var queryTemporalToken = queryParams['temporalToken'];
      if (queryTemporalToken) {
        $location.search('temporalToken', null);
        try {
          if (jwtHelper.isTokenExpired(queryTemporalToken)) {
            $location.path('/temporal-token-error');
            return;
          }
          auth.saveToken(queryTemporalToken, true);
        } catch (error) {
          $location.path('/temporal-token-error');
        }
      }

      verifyAuthorization($location, auth);
    });
  }]);

  //// Uncomment if you want to mock HTTP calls
  //dopplerRelayModule.requires.push('ngMockE2E');
  //dopplerRelayModule.run(['$httpBackend', function ($httpBackend) {
  //  $httpBackend.whenGET(/(\.htm|\.html)$/).passThrough();
  //  $httpBackend.whenPUT(/\/user\/password\/recover/).respond(function (method, url, data) {
  //    console.log("** PUT user/password/recover **");
  //    return [200, {}];
  //  });
  //}]);

  function verifyAuthorization($location, auth) {
    var openForAllUrls = ['/signup/error', '/temporal-token-error']
    var requireLogoutUrls = ['/signup/confirmation', '/login'];
    var requireTemporalAuthUrls = ['/reset-password', '/signup/registration'];

    // TODO: optimize it
    var currentPath = $location.$$path;
    var userIsAuthed = auth.isAuthed();
    var userIsAuthedTemporarily = userIsAuthed && auth.isTemporarilyAuthed();
    var pageOpenForAll = openForAllUrls.includes(currentPath);
    var pageRequireLogout = requireLogoutUrls.includes(currentPath);
    var pageRequireTemporalAuth = requireTemporalAuthUrls.includes(currentPath);

    if (pageOpenForAll) {
      // Idea: it is possible to setup a flag on redirection, to avoid to enter to this page directly
      return;
    }

    if (pageRequireLogout) {
      // It is not necessary to test if userIsAuthed
      auth.logOut();
      return;
    }

    if (pageRequireTemporalAuth && !userIsAuthedTemporarily) {
      $location.path('/temporal-token-error');
      return;
    }

    if (!userIsAuthed || (!pageRequireTemporalAuth && userIsAuthedTemporarily)) {
      $location.path('/login');
      return;
    }
  }

  typekitLoad('hdx0jiv', function () {
    // Typekit failed to download or initialize
  });

})();
