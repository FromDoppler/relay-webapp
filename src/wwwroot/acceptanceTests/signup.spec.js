'use strict';

describe('Signup', () => {

  function createContext() {
    module('dopplerRelay');
    var context;
    inject(function ($controller, $location, $rootScope, auth, $httpBackend, jwtHelper, signup) {

      var errors = [];
      $rootScope.addError = err => errors.push(err);
      $rootScope.addAuthorizationError = $rootScope.addError;
      $rootScope.getTermsAndConditionsVersion = function () {
        return 1;
      };

      context = {
        errors: errors,
        $location: $location,
        $rootScope: $rootScope,
        $scope: $rootScope.$new(),
        $httpBackend: $httpBackend,
        jwtHelper: jwtHelper,
        auth: auth,
        signup: signup,
        createController: controllerName => $controller(controllerName, {
          $location: context.$location,
          $rootScope: context.$rootScope,
          $scope: context.$scope,
          auth: auth,
          vcRecaptchaService: null
        })
      }
    });
    return context;
  };

  var prepareForm = function (scope, fieldNames) {
    var form = {
      $setPristine: () => {},
      $setUntouched: () => {}
    };
    for (var fieldName of fieldNames) {
      let field = {
        $error: {},
        $setViewValue: () => {},
        $setValidity: (validationErrorKey, isValid) => {
          if (isValid === false) {
            field.$error[validationErrorKey] = true;
          } else if (field.$error.validationErrorKey) {
            delete field.$error.validationErrorKey;
          }
        }
      };
      form[fieldName] = field;
    }
    scope.form = form;
    return form;
  };

  describe('Confirmation', () => {
    describe('initial status', () => {

      it('should be error page when activation token (query string parameter) is not set', () => {
        // Arrange
        var { $location, $httpBackend, $scope, createController } = createContext();

        $httpBackend.expect(
          'GET',
          url => url.endsWith('/resources/industries.json')
        ).respond(200, []);

        $httpBackend.expect(
          'GET',
           url => url.endsWith('/resources/countries.json')
        ).respond(200, []);

        $location.path("/signup/confirmation");

        // Act
        var controller = createController('ConfirmationCtrl');
        $httpBackend.flush();
        $scope.$apply(); // To run app.js code

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/error');
      });

      it('should log-off when an user is logged-in (when activation token is not set)', () => {
        // Arrange
        var { $location, $scope, createController, auth } = createContext();

        auth.saveToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODM2MjQ3NjAsImV4cCI6MTQ4NjIxNjc2MCwiaWF0IjoxNDgzNjI0NzYwLCJpc3MiOiJodHRwOi8vZG9wcGxlcnJlbGF5aW50Lm1ha2luZ3NlbnNlLmNvbTo4MDgwIiwic3ViIjo3MDAwMiwidW5pcXVlX25hbWUiOiJ1c2VybmFtZTJAZG9wcGxlcnJlbGF5LmNvbSIsInJlbGF5X2FjY291bnRzIjpbImFjY291bnQyIl0sInJlbGF5X3Rva2VuX3ZlcnNpb24iOiIxLjAuMC1iZXRhNSJ9.Ee2eb88xqZpkLUoX2AET2_SiDodzxCltFxaIVpJQ4DXtteXpt_1eB5WjEcV4t0KryrWLw4M0Yc_xRaXWYsXFMCBPwy53qpMzeNg39rEK70cYdlvNV_mLQz9Q0fesxYQPjWeNelg1GGrbiYtx5ljiLZStav-rouoHeye5uu9tAFVc8NVNIjmwuy87aWmH0oeuccNszrKjYndACno_K7Wna5JOQpXLsR6VZhcTeyUAaXvfGlhRPtZ2QQYrxW1APfXNCAcwtK8R07qoIKACvY-opH6xXdSl1fuhHDWzpeq7xWsiJswgtiCHkNiXOItOA5z-OQqnutQcZ4ReLuxuczhn7g");
        expect(auth.isAuthed()).toBe(true);
        expect(auth.getAccountName()).toBe('account2');

        // Act
        $location.path("/signup/confirmation");
        $scope.$apply(); // To run app.js code
        var controller = createController('ConfirmationCtrl');

        // Assert
        expect(auth.isAuthed()).toBe(false);
        expect($location.path()).toBe('/signup/error');
      });

      it('should not log-off when an user is logged-in and goes directly to the error page', () => {
        // Arrange
        var { $location, $scope, createController, auth } = createContext();

        auth.saveToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODM2MjQ3NjAsImV4cCI6MTQ4NjIxNjc2MCwiaWF0IjoxNDgzNjI0NzYwLCJpc3MiOiJodHRwOi8vZG9wcGxlcnJlbGF5aW50Lm1ha2luZ3NlbnNlLmNvbTo4MDgwIiwic3ViIjo3MDAwMiwidW5pcXVlX25hbWUiOiJ1c2VybmFtZTJAZG9wcGxlcnJlbGF5LmNvbSIsInJlbGF5X2FjY291bnRzIjpbImFjY291bnQyIl0sInJlbGF5X3Rva2VuX3ZlcnNpb24iOiIxLjAuMC1iZXRhNSJ9.Ee2eb88xqZpkLUoX2AET2_SiDodzxCltFxaIVpJQ4DXtteXpt_1eB5WjEcV4t0KryrWLw4M0Yc_xRaXWYsXFMCBPwy53qpMzeNg39rEK70cYdlvNV_mLQz9Q0fesxYQPjWeNelg1GGrbiYtx5ljiLZStav-rouoHeye5uu9tAFVc8NVNIjmwuy87aWmH0oeuccNszrKjYndACno_K7Wna5JOQpXLsR6VZhcTeyUAaXvfGlhRPtZ2QQYrxW1APfXNCAcwtK8R07qoIKACvY-opH6xXdSl1fuhHDWzpeq7xWsiJswgtiCHkNiXOItOA5z-OQqnutQcZ4ReLuxuczhn7g");
        expect(auth.isAuthed()).toBe(true);
        expect(auth.getAccountName()).toBe('account2');

        // Act
        $location.path("/signup/error");
        $scope.$apply(); // To run app.js code

        // Assert
        expect(auth.isAuthed()).toBe(true);
        expect(auth.getAccountName()).toBe('account2');
      });

      it('should log-off when an user is logged-in (when activation token is set)', () => {
        // Arrange
        var { $location, $httpBackend, $scope, createController, auth } = createContext();

        $httpBackend.expect(
          'GET',
          url => url.endsWith('/user')
        ).respond({});

        auth.saveToken("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODM2MjQ3NjAsImV4cCI6MTQ4NjIxNjc2MCwiaWF0IjoxNDgzNjI0NzYwLCJpc3MiOiJodHRwOi8vZG9wcGxlcnJlbGF5aW50Lm1ha2luZ3NlbnNlLmNvbTo4MDgwIiwic3ViIjo3MDAwMiwidW5pcXVlX25hbWUiOiJ1c2VybmFtZTJAZG9wcGxlcnJlbGF5LmNvbSIsInJlbGF5X2FjY291bnRzIjpbImFjY291bnQyIl0sInJlbGF5X3Rva2VuX3ZlcnNpb24iOiIxLjAuMC1iZXRhNSJ9.Ee2eb88xqZpkLUoX2AET2_SiDodzxCltFxaIVpJQ4DXtteXpt_1eB5WjEcV4t0KryrWLw4M0Yc_xRaXWYsXFMCBPwy53qpMzeNg39rEK70cYdlvNV_mLQz9Q0fesxYQPjWeNelg1GGrbiYtx5ljiLZStav-rouoHeye5uu9tAFVc8NVNIjmwuy87aWmH0oeuccNszrKjYndACno_K7Wna5JOQpXLsR6VZhcTeyUAaXvfGlhRPtZ2QQYrxW1APfXNCAcwtK8R07qoIKACvY-opH6xXdSl1fuhHDWzpeq7xWsiJswgtiCHkNiXOItOA5z-OQqnutQcZ4ReLuxuczhn7g");
        $location.path('/signup/confirmation');
        $location.search({ activation: 'wrongcode'});
        $httpBackend.expect(
          'GET',
          url => url.endsWith('/resources/industries.json')
        ).respond(200, []);

        $httpBackend.expect(
          'GET',
           url => url.endsWith('/resources/countries.json')
        ).respond(200, []);

        // Act
        var controller = createController('ConfirmationCtrl');
        expect(auth.isAuthed()).toBe(true);
        $scope.$apply(); // To run app.js code

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        expect(auth.isAuthed()).toBe(false);
        expect($location.path()).toBe('/signup/confirmation');
      });

      it('should be error page when activation token is not valid', () => {
        // Arrange
        var { $location, $httpBackend, createController } = createContext();

        $httpBackend.expect(
          'GET',
          url => url.endsWith('/user')
        ).respond(401, {});

        $httpBackend.expect(
          'GET',
          url => url.endsWith('/resources/industries.json')
        ).respond(200, []);

        $httpBackend.expect(
          'GET',
           url => url.endsWith('/resources/countries.json')
        ).respond(200, []);

        $location.path('/signup/confirmation');
        $location.search('activation', 'wrongcode');

        // Act
        var controller = createController('ConfirmationCtrl');
        $httpBackend.flush();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/error');
      });

      it('should be error page when activation token is related to an already activated user', () => {
        // Arrange
        var { $location, $httpBackend, createController } = createContext();

        $httpBackend.expect(
          'GET',
          url => url.endsWith('/user'),
          null, // data
          headers => headers["Authorization"] == "token rightcode"
        ).respond(200, {
          "user_email": "a@a.com",
          "account_name": "accountname",
          "domain": "domain.com",
          "firstName": "first",
          "lastName": "last"
        });

        $httpBackend.expect(
          'GET',
          url => url.endsWith('/resources/industries.json')
        ).respond(200, []);

        $httpBackend.expect(
          'GET',
           url => url.endsWith('/resources/countries.json')
        ).respond(200, []);

        $location.path('/signup/confirmation');
        $location.search('activation', 'rightcode');

        // Act
        var controller = createController('ConfirmationCtrl');
        $httpBackend.flush();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/error');
      });

      it('should be error page when activation token is not valid on creating key HTTP request', () => {
        // Arrange
        var { $location, $httpBackend, createController } = createContext();

        $httpBackend.expect(
          'GET',
          url => url.endsWith("/user"),
          null, // data
          headers => headers["Authorization"] == "token rightcode"
        ).respond(200, {
          "user_email": "a@a.com",
          "account_name": "accountname",
          "pending_activation": "true",
          "domain": "domain.com",
          "firstName": "first",
          "lastName": "last"
        });

        $httpBackend.expect(
          'GET',
          url => url.endsWith('/resources/industries.json')
        ).respond(200, []);

        $httpBackend.expect(
          'GET',
           url => url.endsWith('/resources/countries.json')
        ).respond(200, []);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/apikeys'),
          null, // data
          headers => headers["Authorization"] == "token rightcode"
        ).respond(401, {});

        $location.path('/signup/confirmation');
        $location.search('activation', 'rightcode');

        // Act
        var controller = createController('ConfirmationCtrl');
        $httpBackend.flush();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/error');
      });
    });

    describe('result', () => {
      it('should have right values after successful requests', () => {
        // Arrange
        var { $location, $httpBackend, createController } = createContext();

        var expected = {
          user_email: 'a@a.com',
          firstName: 'first',
          domain: 'domain.com',
          newApiKey: 'newApiKey'
        };

        $httpBackend.expect(
          'GET',
          url => url.endsWith("/user"),
          null, // data
          headers => headers['Authorization'] == 'token rightcode'
        ).respond(200, {
          user_email: expected.user_email,
          account_name: 'accountname',
          pending_activation: true,
          domain: expected.domain,
          firstName: expected.firstName,
          lastName: 'last'
        });

        $httpBackend.expect(
          'GET',
          url => url.endsWith('/resources/industries.json')
        ).respond(200, []);

        $httpBackend.expect(
          'GET',
           url => url.endsWith('/resources/countries.json')
        ).respond(200, []);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/apikeys'),
          null, // data
          headers => headers["Authorization"] == "token rightcode"
        ).respond(201, {
          "api_key": expected.newApiKey
        });

        $location.path('/signup/confirmation');
        $location.search('activation', 'rightcode');

        // Act
        var controller = createController('ConfirmationCtrl');
        $httpBackend.flush();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/confirmation');
        expect(controller.userName).toBe(expected.user_email);
        expect(controller.name).toBe(expected.firstName);
        expect(controller.domain).toBe(expected.domain);
        expect(controller.apiKey).toBe(expected.newApiKey);
      });

      it('should have email as name when firstName is empty', () => {
        // Arrange
        var { $location, $httpBackend, createController } = createContext();

        var expected = {
          user_email: 'a@a.com',
          domain: 'domain.com',
          newApiKey: 'newApiKey'
        };

        $httpBackend.expect(
          'GET',
          url => url.endsWith("/user"),
          null, // data
          headers => headers['Authorization'] == 'token rightcode'
        ).respond(200, {
          user_email: expected.user_email,
          account_name: 'accountname',
          pending_activation: true,
          domain: expected.domain,
          firstName: '',
          lastName: 'last'
        });

        $httpBackend.expect(
        'GET',
        url => url.endsWith('/resources/industries.json')
        ).respond(200, []);

        $httpBackend.expect(
        'GET',
         url => url.endsWith('/resources/countries.json')
        ).respond(200, []);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/apikeys'),
          null, // data
          headers => headers["Authorization"] == "token rightcode"
        ).respond(201, {
          "api_key": expected.newApiKey
        });

        $location.path('/signup/confirmation');
        $location.search('activation', 'rightcode');

        // Act
        var controller = createController('ConfirmationCtrl');
        $httpBackend.flush();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/confirmation');
        expect(controller.name).toBe(expected.user_email);
      });

      it('should have error message when there is an unexpected error verifying activation token', () => {
        // Arrange
        var { $location, $httpBackend, createController, errors } = createContext();

        $httpBackend.expect(
          'GET',
          url => url.endsWith('/user')
        ).respond(500, {});

        $httpBackend.expect(
          'GET',
          url => url.endsWith('/resources/industries.json')
        ).respond(200, []);

        $httpBackend.expect(
          'GET',
           url => url.endsWith('/resources/countries.json')
        ).respond(200, []);

        $location.path('/signup/confirmation');
        $location.search('activation', 'wrongcode');

        // Act
        var controller = createController('ConfirmationCtrl');
        $httpBackend.flush();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect(errors.length).toBe(1);
        expect($location.path()).toBe('/signup/confirmation');
      });
    });
  });

  describe('Registration', () => {
    describe('initial status', () => {
      it('should show the registration page correctly', () => {
        // Arrange
        var { $location, $scope, auth, jwtHelper } = createContext();
        expect(auth.isAuthed()).toBe(false);

        // Act
        $location.path('/signup/registration');
        $scope.$apply(); // To run app.js code

        // Assert
        expect($location.path()).toBe('/signup/registration');
        expect(auth.isAuthed()).toBe(false);
      });
    });

    describe('result', () => {
      it('should set the flag correctly when the creation is successful', () => {
        // Arrange
        var { $location, $scope, createController, jwtHelper, $httpBackend } = createContext();
        jwtHelper.isTokenExpired = () => false;
        var form = prepareForm($scope, [ 'accountName', 'email' ]);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/registration?lang=en'),
          '{"user_email":"a@a.com","firstName":"first","lastName":"last","password":"1qaz2WSX","account_name":"accountname","company_name":"MakingSense","terms_and_conditions_version":1}'
        ).respond(200, {
          
        });

        $location.path('/signup/registration');

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "1qaz2WSX";
        controller.accountName = "accountname";
        controller.company = "MakingSense";
        controller.checkTerms = true;
        controller.language = "en";
        controller.submitRegistration(form);
        $httpBackend.flush();


        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/succeed');
      });

      it('should not set the flag when the creation returns an Unexpected error', () => {
        // Arrange
        var { $location, $scope, createController, jwtHelper, $httpBackend } = createContext();
        jwtHelper.isTokenExpired = () => false;
        var form = {};

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/registration?lang=en')
        ).respond(500, "Unexpected error");

        $location.path('/signup/registration');

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "pass";
        controller.accountName = "accountname";
        controller.company = "MakingSense";
        controller.language = "en";
        controller.submitRegistration(form);
        $httpBackend.flush();
        $scope.$apply();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/registration');
        expect(controller.emailRegistered).toBe(null);
      });

      it('should set email error when email already exist', () => {
        // Arrange
        var { $location, $scope, createController, jwtHelper, $httpBackend, $rootScope } = createContext();
        jwtHelper.isTokenExpired = () => false;
        var form = prepareForm($scope, [ 'accountName', 'email' ]);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/registration?lang=en'),
          '{"user_email":"a@a.com","firstName":"first","lastName":"last","password":null,"account_name":"accountname","company_name":"MakingSense","terms_and_conditions_version":1}'
        ).respond(400, {
          "title": "Validation error",
          "status": 400,
          "errorCode": 3,
          "detail": "Validation error validating `/schemas/user.json` for `password`. See `errors` field for more details.",
          "errors": [
            { "key": "user_email", "detail": "Already exists an user with email address \"a@a.com\"."}
          ],
          "type": "/docs/errors/400.3-validation-error"
        });

        $location.path('/signup/registration');

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "";
        controller.accountName = "accountname";
        controller.company = "MakingSense";
        controller.checkTerms = true;
        controller.language = "en";
        controller.submitRegistration(form);
        $httpBackend.flush();
        $scope.$apply();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/registration');
        expect(controller.emailRegistered).toBe(null);
        expect(form.accountName.$error.accountname_already_taken).toBeFalsy();
        expect(form.email.$error.email_already_exist).toBe(true);
      });

      it('should set account name error when account name already exist', () => {
        // Arrange
        var { $location, $scope, createController, jwtHelper, $httpBackend, $rootScope } = createContext();
        jwtHelper.isTokenExpired = () => false;
        var form = prepareForm($scope, [ 'accountName', 'email' ]);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/registration?lang=en'),
          '{"user_email":"a@a.com","firstName":"first","lastName":"last","password":null,"account_name":"accountname","company_name":"MakingSense","terms_and_conditions_version":1}'
        ).respond(400, {
          "title": "Validation error",
          "status": 400,
          "errorCode": 3,
          "detail": "Validation error validating `/schemas/user.json` for `password`. See `errors` field for more details.",
          "errors": [
            { "key": "account_name", "detail": "Account name \"accountname\" has been already taken."}
          ],
          "type": "/docs/errors/400.3-validation-error"
        });

        $location.path('/signup/registration');

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "";
        controller.accountName = "accountname";
        controller.company = "MakingSense";
        controller.checkTerms = true;
        controller.language = "en";
        controller.submitRegistration(form);
        $httpBackend.flush();
        $scope.$apply();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/registration');
        expect(controller.emailRegistered).toBe(null);
        expect(form.accountName.$error.accountname_already_taken).toBe(true);
        expect(form.email.$error.email_already_exist).toBeFalsy();
      });

      it('should set email and account name error when both already exist', () => {
        // Arrange
        var { $location, $scope, createController, jwtHelper, $httpBackend, $rootScope } = createContext();
        jwtHelper.isTokenExpired = () => false;
        var form = prepareForm($scope, [ 'accountName', 'email' ]);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/registration?lang=en'),
          '{"user_email":"a@a.com","firstName":"first","lastName":"last","password":null,"account_name":"accountname","company_name":"MakingSense","terms_and_conditions_version":1}'
        ).respond(400, {
          "title": "Validation error",
          "status": 400,
          "errorCode": 3,
          "detail": "Validation error validating `/schemas/user.json` for `password`. See `errors` field for more details.",
          "errors": [
            { "key": "user_email", "detail": "Already exists an user with email address \"a@a.com\"."},
            { "key": "account_name", "detail": "Account name \"accountname\" has been already taken."}
          ],
          "type": "/docs/errors/400.3-validation-error"
        });

        $location.path('/signup/registration');

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "";
        controller.accountName = "accountname";
        controller.company = "MakingSense";
        controller.checkTerms = true;
        controller.language = "en";
        controller.submitRegistration(form);
        $httpBackend.flush();
        $scope.$apply();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/registration');
        expect(controller.emailRegistered).toBe(null);
        expect(form.accountName.$error.accountname_already_taken).toBe(true);
        expect(form.email.$error.email_already_exist).toBe(true);
      });

      it('should send email using null values when password and domain are empty', () => {
        // Arrange
        var { $location, $scope, createController, jwtHelper, $httpBackend, $rootScope } = createContext();
        jwtHelper.isTokenExpired = () => false;
        var form = prepareForm($scope, [ 'accountName', 'email' ]);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/registration?lang=en'),
          '{"user_email":"a@a.com","firstName":"first","lastName":"last","password":null,"account_name":"accountname","company_name":null,"terms_and_conditions_version":1}'
        ).respond(202);

        $location.path('/signup/registration');

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "";
        controller.accountName = "accountname";
        controller.company = "";
        controller.checkTerms = true;
        controller.language = "en";
        controller.submitRegistration(form);
        $httpBackend.flush();
        $scope.$apply();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/succeed');
      });
    });
  });
});
