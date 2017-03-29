'use strict';

describe('Login', () => {

  function createContext() {
    // Ugly patch, localStorage should be cleaned before initialize module
    localStorage.clear();

    module('dopplerRelay');
    var context;
    inject(function ($controller, $location, $rootScope, auth, $httpBackend) {

      var errors = [];
      $rootScope.addError = err => errors.push(err);
      $rootScope.addAuthorizationError = $rootScope.addError;

      context = {
        errors: errors,
        $location: $location,
        $rootScope: $rootScope,
        $scope: $rootScope.$new(),
        $httpBackend: $httpBackend,
        auth: auth,
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

  describe('authentication', () => {
    it('should redirect to reports when authentication is successful', () => {
      // Arrange
      var email = 'amoschini@makingsense.com';
      var password = 'amoschini';
      var { $location, $scope, $httpBackend, auth, createController } = createContext();

      $location.path('/login');
      createController('LoginCtrl');
      $scope.loginform = {};
      $scope.$apply(); // To run app.js code
      expect(auth.isAuthed()).toBe(false);
      $httpBackend.expect(
        'POST',
        url => url.endsWith('/tokens'),
        '{"username":"amoschini@makingsense.com","password":"amoschini"}'
      ).respond(200, {
        "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ3NjI2NjYsImV4cCI6MTQ4NzM1NDY2NiwiaWF0IjoxNDg0NzYyNjY2LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.CaW8TdRwf77FzfyQB20AgE9Sd13k4RBeMgwBwJuCgg03NI0fhu7nTx7YPoTKQNxkU-3C3PhvJQHqDI2pU6ThS8dKsRHeJZoT8OxwiFbOYmnii33WcpmkVcLoUbfA8aXcVVFVTiXGN8LngE9Mml8nd7udxtvxcwv9uDMh0-u-FACBxrmX66Cth2_pNL6AzkAC91rRvf3MTUZ8IXOMbsxTaSMydsPqhtqlPoczbTYHaLCW0JRyANKNqhPMHRH14rfZLUyfOPC1_l4VgnQHt7_w95rJm5nFLsWk10Ji8ALoB-i8q5WUDQcKqwGt2Ar2z8ruRyjdx1aHTY5x-f0MFTTTGw",
      });

      // Act
      $scope.email = email;
      $scope.password = password;
      $scope.submitLogin();
      $httpBackend.flush();

      // Assert
      expect($location.path()).toBe('/'); // then it will redirect to `/reports` because of _otherwise_ route, I do not know how to test it
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
      expect(auth.getUserName()).toBe('amoschini@makingsense.com');
    });

    it('should not redirect to reports when authentication fails', () => {
      // Arrange
      var email = 'amoschini@makingsense.com';
      var password = 'wrong';
      var { $location, $scope, $httpBackend, auth, createController } = createContext();

      $location.path('/login');
      createController('LoginCtrl');
      $scope.loginform = {
        email: { $setValidity: () => {} },
        password: { $setValidity: () => {} }
      };
      $scope.$apply(); // To run app.js code
      expect(auth.isAuthed()).toBe(false);
      $httpBackend.expect(
        'POST',
        url => url.endsWith('/tokens'),
        '{"username":"amoschini@makingsense.com","password":"wrong"}'
      ).respond(401, {
        "title": "Authentication error",
        "detail": "User or Password incorrect",
        "errorCode": 2,
        "status": 401,
        "type": "/docs/errors/401.2-authentication-error"
      });

      // Act
      $scope.email = email;
      $scope.password = password;
      $scope.submitLogin();
      $httpBackend.flush();

      // Assert
      expect($location.path()).toBe('/login');
      expect(auth.isAuthed()).toBe(false);
    });
  });
});
