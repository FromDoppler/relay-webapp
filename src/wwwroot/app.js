(function () {
  'use strict';

  function getLocale(lang) {
    return window['relay-translation-' + lang];
  }

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
        'daterangepicker',
        'ui.select',
        'slugifier',
        '720kb.tooltips',
        'rzModule',
        'ui.mask',
        'vcRecaptcha'
    ])
    .filter('escapeURI', function(){
      return window.encodeURIComponent;
    })
    .config([
      '$routeProvider', 
      '$translateProvider', 
      '$locationProvider', 
      '$httpProvider', 
      'jwtInterceptorProvider', 
      'uiSelectConfig', 
      'tooltipsConfProvider',
      '$provide',
      function (
        $routeProvider,
        $translateProvider,
        $locationProvider,
        $httpProvider,
        jwtInterceptorProvider,
        uiSelectConfig,
        tooltipsConfProvider,
        $provide) {

      function makeStateful($delegate) {
        $delegate.$stateful = true;
        return $delegate;
      }

      $provide.decorator('dateFilter', ['$delegate', makeStateful]);
      $provide.decorator('numberFilter', ['$delegate', makeStateful]);
      $provide.decorator('currencyFilter', ['$delegate', makeStateful]);


      //  $locationProvider.html5Mode(true); //this apply HTML5MODE
      uiSelectConfig.theme = 'selectize';
      tooltipsConfProvider.configure({
        'smart':true,
        'size':'large',
        'speed': 'fast',
        'tooltipTemplateUrlCache': true
      });


      $routeProvider
        .when('/login', {
          templateUrl: 'partials/login/login.html',
          controller: 'LoginCtrl',
          controllerAs: 'vm'
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
        .when('/settings/domain-manager/resubscribe', {
          templateUrl: 'partials/settings/domain-manager/resubscribe.html',
          controller: 'ResubscribeCtrl',
          controllerAs: 'vm'
        })
        .when('/settings/domain-manager/dkim-configuration-help', {
          templateUrl: 'partials/settings/domain-manager/dkim-configuration-help.html',
          controller: 'dKimConfigCtrl',
          controllerAs: 'vm'
        })
        .when('/settings/my-profile', {
          templateUrl: 'partials/settings/my-profile.html',
          controller: 'MyProfileCtrl',
          controllerAs: 'vm'
        })
        .when('/signup/registration', {
          templateUrl: 'partials/signup/registration.html',
          controller: 'RegistrationCtrl',
          controllerAs: 'vm'
        })
        .when('/settings/my-plan', {
          templateUrl: 'partials/settings/my-plan.html',
          controller: 'PlanCtrl',
          controllerAs: 'vm'
        })
        .when('/settings/my-billing-information', {
          templateUrl: 'partials/settings/my-billing-information.html',
          controller: 'MyBillingInformationCtrl',
          controllerAs: 'vm'
        })
        .when('/settings/billing', {
          templateUrl: 'partials/settings/billing.html',
          controller: 'BillingCtrl',
          controllerAs: 'vm'
        })
        .when('/signup/succeed', {
          templateUrl: 'partials/signup/succeed.html',
          controller: 'SucceedRegistrationCtrl',
          controllerAs: 'vm'
        })
        .when('/change-email', {
          template: ' ',
          controller: 'ChangeEmailCtrl'
        })   
        .when('/loginAdmin', {
          templateUrl: 'partials/login/login-admin.html',
          controller: 'LoginAdminCtrl',
          controllerAs: 'vm'
        })     
        .otherwise({
          redirectTo: '/reports'
        });

      $translateProvider
        .translations('en', getLocale('en'))
        .translations('es', getLocale('es'))
        .preferredLanguage('en')
        .useSanitizeValueStrategy('sanitizeParameters');

      jwtInterceptorProvider.tokenGetter = ['auth', function (auth) { return auth.getApiToken(); }];

      $httpProvider.interceptors.push('jwtInterceptor');

      $httpProvider.interceptors.push('errorHandlerInterceptor');

    }]);

  dopplerRelayModule.run([
    '$rootScope', 
    'auth', 
    '$location', 
    '$window', 
    '$translate', 
    'jwtHelper', 
    '$locale',
    'utils',
    function (
      $rootScope,
      auth,
      $location, 
      $window, 
      $translate, 
      jwtHelper,
      $locale,
      utils) {

    function applyCultureFormats() {
      var locale = getLocale($translate.use());
      angular.merge($locale, locale['CULTURE_FORMATS']);
    }

    applyCultureFormats();

    $rootScope.$on('$translateChangeEnd', applyCultureFormats);

    $rootScope.$on('$locationChangeStart', function () {
      if ($window.ga) {
        $window.ga('send', {
          'hitType': 'pageview',
          'page': $location.url()
        }); 
      }
      var queryParams = $location.search();

      var queryLang = queryParams['lang'];
      if (queryLang) {
        $location.search('lang', null);
        $translate.use(queryLang);
        utils.setPreferredLanguage(queryLang);
      }

      var queryTemporalToken = queryParams['temporalToken'];
      if (queryTemporalToken) {
        $location.search('temporalToken', null);
        try {
          if (jwtHelper.isTokenExpired(queryTemporalToken)) {
            $location.path('/temporal-token-error');
            return;
          }
          auth.loginByToken(queryTemporalToken);
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
    var openForAllUrls = ['/signup/error', '/temporal-token-error', '/dkim-configuration-tutorial'];
    var requireLogoutUrls = ['/signup/confirmation', '/login', '/signup/registration', '/signup/succeed', '/loginAdmin'];
    var requireTemporalAuthUrls = ['/reset-password', '/change-email'];

    // TODO: optimize it
    var currentPath = $location.$$path;
    var userIsAuthed = auth.isAuthed();
    var userIsAuthedTemporarily = userIsAuthed && auth.isTemporarilyAuthed();
    var pageOpenForAll = openForAllUrls.includes(currentPath);
    var pageRequireLogout = requireLogoutUrls.includes(currentPath);
    var pageRequireTemporalAuth = requireTemporalAuthUrls.includes(currentPath);
        
    if(!auth.isUrlAllowed(currentPath)) {
      $location.path(auth.getDefaultUrl() || '/login');
    }

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
})();
