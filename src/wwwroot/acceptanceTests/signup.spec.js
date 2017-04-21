'use strict';

describe('Signup', () => {

  function createContext() {
    module('dopplerRelay');
    var context;
    inject(function ($controller, $location, $rootScope, auth, $httpBackend, jwtHelper, signup) {

      var errors = [];
      $rootScope.addError = err => errors.push(err);
      $rootScope.addAuthorizationError = $rootScope.addError;

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
          auth: auth
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
        var { $location, $scope, createController } = createContext();

        $location.path("/signup/confirmation");

        // Act
        var controller = createController('ConfirmationCtrl');
        $scope.$apply(); // To run app.js code

        // Assert
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
      it('should show the registration page correctly with the temporal token', () => {
        // Arrange
        var { $location, $scope, auth, jwtHelper } = createContext();
        expect(auth.isAuthed()).toBe(false);
        jwtHelper.isTokenExpired = () => false;

        // Act
        $location.path('/signup/registration');
        $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MjAxMjEsImV4cCI6MTQ4NDYyMzcyMSwiaWF0IjoxNDg0NjIwMTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwidW5pcXVlX25hbWUiOiJhbW9zY2hpbmkrMUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9vbl9wYXNzd29yZF9yZXNldCI6dHJ1ZX0.dEFvbFzwmMDckjTPdih2WjC5fkkXMEirOxQcptJOh_vUtOU8c6psldSt4TsfL6znkFi2df9I4LVDnLUHVZG_PClkukqvQZ_EKJrUdx4PhGeRn9GL_bpYlOXr_G4VPs9h4s20Rq8fWDC4uYKIncXgQtP-po1VZHez8RyRv-xVUKTRouFfdt29usu_DPscvpVFn0P_J4qxkGnWcsHWGmexEVBbMP8_W_YCxz23FgH8vjkNo54j1wWFsOfxzZivNG92kgPcTE4PVXxn4y4yRmRS03m1mpnEL46CZ127utyhRSg91f4Imz3kgM6t4cpacxObUOMWdw86kL2flSbYUh4pxQ'});
        $scope.$apply(); // To run app.js code

        // Assert
        expect($location.path()).toBe('/signup/registration');
        expect(auth.isAuthed()).toBe(true);
        expect(auth.isTemporarilyAuthed()).toBe(true);
      });

      it('should not be able to get into the registration page without the temporal token', () => {
        // Arrange
        var { $location, $scope, auth, jwtHelper } = createContext();
        expect(auth.isAuthed()).toBe(false);
        jwtHelper.isTokenExpired = () => false;

        // Act
        $location.path('/signup/registration');
        $scope.$apply(); // To run app.js code

        // Assert
        expect($location.path()).toBe('/temporal-token-error');
        expect(auth.isAuthed()).toBe(false);
        expect(auth.isTemporarilyAuthed()).toBe(false);
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
          '{"user_email":"a@a.com","firstName":"first","lastName":"last","password":"1qaz2WSX","account_name":"accountname","company":"MakingSense"}'
        ).respond(200, {
          "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ3NjI2NjYsImV4cCI6MTQ4NzM1NDY2NiwiaWF0IjoxNDg0NzYyNjY2LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.CaW8TdRwf77FzfyQB20AgE9Sd13k4RBeMgwBwJuCgg03NI0fhu7nTx7YPoTKQNxkU-3C3PhvJQHqDI2pU6ThS8dKsRHeJZoT8OxwiFbOYmnii33WcpmkVcLoUbfA8aXcVVFVTiXGN8LngE9Mml8nd7udxtvxcwv9uDMh0-u-FACBxrmX66Cth2_pNL6AzkAC91rRvf3MTUZ8IXOMbsxTaSMydsPqhtqlPoczbTYHaLCW0JRyANKNqhPMHRH14rfZLUyfOPC1_l4VgnQHt7_w95rJm5nFLsWk10Ji8ALoB-i8q5WUDQcKqwGt2Ar2z8ruRyjdx1aHTY5x-f0MFTTTGw"
        });

        $location.path('/signup/registration');
        $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MjAxMjEsImV4cCI6MTQ4NDYyMzcyMSwiaWF0IjoxNDg0NjIwMTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwidW5pcXVlX25hbWUiOiJhbW9zY2hpbmkrMUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9vbl9wYXNzd29yZF9yZXNldCI6dHJ1ZX0.dEFvbFzwmMDckjTPdih2WjC5fkkXMEirOxQcptJOh_vUtOU8c6psldSt4TsfL6znkFi2df9I4LVDnLUHVZG_PClkukqvQZ_EKJrUdx4PhGeRn9GL_bpYlOXr_G4VPs9h4s20Rq8fWDC4uYKIncXgQtP-po1VZHez8RyRv-xVUKTRouFfdt29usu_DPscvpVFn0P_J4qxkGnWcsHWGmexEVBbMP8_W_YCxz23FgH8vjkNo54j1wWFsOfxzZivNG92kgPcTE4PVXxn4y4yRmRS03m1mpnEL46CZ127utyhRSg91f4Imz3kgM6t4cpacxObUOMWdw86kL2flSbYUh4pxQ'});

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "1qaz2WSX";
        controller.accountName = "accountname";
        controller.company = "MakingSense";
        controller.language = "en";
        controller.submitRegistration(form);
        $httpBackend.flush();


        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/registration');
        expect(controller.emailRegistered).not.toBeNull();
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
        $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MjAxMjEsImV4cCI6MTQ4NDYyMzcyMSwiaWF0IjoxNDg0NjIwMTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwidW5pcXVlX25hbWUiOiJhbW9zY2hpbmkrMUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9vbl9wYXNzd29yZF9yZXNldCI6dHJ1ZX0.dEFvbFzwmMDckjTPdih2WjC5fkkXMEirOxQcptJOh_vUtOU8c6psldSt4TsfL6znkFi2df9I4LVDnLUHVZG_PClkukqvQZ_EKJrUdx4PhGeRn9GL_bpYlOXr_G4VPs9h4s20Rq8fWDC4uYKIncXgQtP-po1VZHez8RyRv-xVUKTRouFfdt29usu_DPscvpVFn0P_J4qxkGnWcsHWGmexEVBbMP8_W_YCxz23FgH8vjkNo54j1wWFsOfxzZivNG92kgPcTE4PVXxn4y4yRmRS03m1mpnEL46CZ127utyhRSg91f4Imz3kgM6t4cpacxObUOMWdw86kL2flSbYUh4pxQ'});

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
        var { $location, $scope, createController, jwtHelper, $httpBackend } = createContext();
        jwtHelper.isTokenExpired = () => false;
        var form = prepareForm($scope, [ 'accountName', 'email' ]);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/registration?lang=en'),
          '{"user_email":"a@a.com","firstName":"first","lastName":"last","password":null,"account_name":"accountname","company":"MakingSense"}'
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
        $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODU4NzA1NTcsImV4cCI6MTUxNDc3NTYwMCwiaWF0IjoxNDg1ODcwNTUzLCJpc3MiOiJodHRwOi8vYXBpLmRvcHBsZXJyZWxheS5jb20iLCJyZWxheV90ZW1wb3JhbF90b2tlbiI6dHJ1ZSwicmVsYXlfaW50ZXJuYWxfYWRtaW5fdG9rZW4iOnRydWV9.fn_Prus5LjVG-gQDGGfjFl-QwuW4GJZU7LasqJzfW3uw-JlsyrnCODIxScvOn6h4xjfWt6VP-6M3ExHLyYPrO64OtK92L6gKKLSS_3GDALo-wpDKh-5djjdhl6tAWuVTrbJVHVcDWpiNHKfHtaag7GLf5Us-Lufk3RqNW-StYG54-RhTM-e_R-Mq5hLzK0vf5m8DHiY1KdVRgV_vw5eetz1-vu-1sRyHS4walr1KQHzvPsXZl9ip8UM8Uc2WEPo9_AUelCAgn7zbpS8XMWedoDRmox_yXnwdv1NAXOlvIg2p9f6RjZxRKZTZkh_JwopzG9MK1peVflCgQOJoIg95qg'});

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "";
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
        expect(form.accountName.$error.accountname_already_taken).toBeFalsy();
        expect(form.email.$error.email_already_exist).toBe(true);
      });

      it('should set account name error when account name already exist', () => {
        // Arrange
        var { $location, $scope, createController, jwtHelper, $httpBackend } = createContext();
        jwtHelper.isTokenExpired = () => false;
        var form = prepareForm($scope, [ 'accountName', 'email' ]);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/registration?lang=en'),
          '{"user_email":"a@a.com","firstName":"first","lastName":"last","password":null,"account_name":"accountname","company":"MakingSense"}'
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
        $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODU4NzA1NTcsImV4cCI6MTUxNDc3NTYwMCwiaWF0IjoxNDg1ODcwNTUzLCJpc3MiOiJodHRwOi8vYXBpLmRvcHBsZXJyZWxheS5jb20iLCJyZWxheV90ZW1wb3JhbF90b2tlbiI6dHJ1ZSwicmVsYXlfaW50ZXJuYWxfYWRtaW5fdG9rZW4iOnRydWV9.fn_Prus5LjVG-gQDGGfjFl-QwuW4GJZU7LasqJzfW3uw-JlsyrnCODIxScvOn6h4xjfWt6VP-6M3ExHLyYPrO64OtK92L6gKKLSS_3GDALo-wpDKh-5djjdhl6tAWuVTrbJVHVcDWpiNHKfHtaag7GLf5Us-Lufk3RqNW-StYG54-RhTM-e_R-Mq5hLzK0vf5m8DHiY1KdVRgV_vw5eetz1-vu-1sRyHS4walr1KQHzvPsXZl9ip8UM8Uc2WEPo9_AUelCAgn7zbpS8XMWedoDRmox_yXnwdv1NAXOlvIg2p9f6RjZxRKZTZkh_JwopzG9MK1peVflCgQOJoIg95qg'});

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "";
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
        expect(form.accountName.$error.accountname_already_taken).toBe(true);
        expect(form.email.$error.email_already_exist).toBeFalsy();
      });

      it('should set email and account name error when both already exist', () => {
        // Arrange
        var { $location, $scope, createController, jwtHelper, $httpBackend } = createContext();
        jwtHelper.isTokenExpired = () => false;
        var form = prepareForm($scope, [ 'accountName', 'email' ]);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/registration?lang=en'),
          '{"user_email":"a@a.com","firstName":"first","lastName":"last","password":null,"account_name":"accountname","company":"MakingSense"}'
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
        $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODU4NzA1NTcsImV4cCI6MTUxNDc3NTYwMCwiaWF0IjoxNDg1ODcwNTUzLCJpc3MiOiJodHRwOi8vYXBpLmRvcHBsZXJyZWxheS5jb20iLCJyZWxheV90ZW1wb3JhbF90b2tlbiI6dHJ1ZSwicmVsYXlfaW50ZXJuYWxfYWRtaW5fdG9rZW4iOnRydWV9.fn_Prus5LjVG-gQDGGfjFl-QwuW4GJZU7LasqJzfW3uw-JlsyrnCODIxScvOn6h4xjfWt6VP-6M3ExHLyYPrO64OtK92L6gKKLSS_3GDALo-wpDKh-5djjdhl6tAWuVTrbJVHVcDWpiNHKfHtaag7GLf5Us-Lufk3RqNW-StYG54-RhTM-e_R-Mq5hLzK0vf5m8DHiY1KdVRgV_vw5eetz1-vu-1sRyHS4walr1KQHzvPsXZl9ip8UM8Uc2WEPo9_AUelCAgn7zbpS8XMWedoDRmox_yXnwdv1NAXOlvIg2p9f6RjZxRKZTZkh_JwopzG9MK1peVflCgQOJoIg95qg'});

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "";
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
        expect(form.accountName.$error.accountname_already_taken).toBe(true);
        expect(form.email.$error.email_already_exist).toBe(true);
      });

      it('should send email using null values when password and domain are empty', () => {
        // Arrange
        var { $location, $scope, createController, jwtHelper, $httpBackend } = createContext();
        jwtHelper.isTokenExpired = () => false;
        var form = prepareForm($scope, [ 'accountName', 'email' ]);

        $httpBackend.expect(
          'POST',
          url => url.endsWith('/user/registration?lang=en'),
          '{"user_email":"a@a.com","firstName":"first","lastName":"last","password":null,"account_name":"accountname","company":null}'
        ).respond(202);

        $location.path('/signup/registration');
        $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODU4NzA1NTcsImV4cCI6MTUxNDc3NTYwMCwiaWF0IjoxNDg1ODcwNTUzLCJpc3MiOiJodHRwOi8vYXBpLmRvcHBsZXJyZWxheS5jb20iLCJyZWxheV90ZW1wb3JhbF90b2tlbiI6dHJ1ZSwicmVsYXlfaW50ZXJuYWxfYWRtaW5fdG9rZW4iOnRydWV9.fn_Prus5LjVG-gQDGGfjFl-QwuW4GJZU7LasqJzfW3uw-JlsyrnCODIxScvOn6h4xjfWt6VP-6M3ExHLyYPrO64OtK92L6gKKLSS_3GDALo-wpDKh-5djjdhl6tAWuVTrbJVHVcDWpiNHKfHtaag7GLf5Us-Lufk3RqNW-StYG54-RhTM-e_R-Mq5hLzK0vf5m8DHiY1KdVRgV_vw5eetz1-vu-1sRyHS4walr1KQHzvPsXZl9ip8UM8Uc2WEPo9_AUelCAgn7zbpS8XMWedoDRmox_yXnwdv1NAXOlvIg2p9f6RjZxRKZTZkh_JwopzG9MK1peVflCgQOJoIg95qg'});

        // Act
        var controller = createController('RegistrationCtrl');
        controller.email = "a@a.com";
        controller.firstName = "first";
        controller.lastName = "last";
        controller.password = "";
        controller.accountName = "accountname";
        controller.company = "";
        controller.language = "en";
        controller.submitRegistration(form);
        $httpBackend.flush();
        $scope.$apply();

        // Assert
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        expect($location.path()).toBe('/signup/registration');
      });
    });
  });
});
