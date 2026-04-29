'use strict';

describe('Login', () => {

  function createContext() {
    // Ugly patch, localStorage should be cleaned before initialize module
    localStorage.clear();

    module('dopplerRelay');

    var mockClerkService = window.ClerkTestHelpers.createClerkMock();

    module(function($provide) {
      $provide.value('clerk', mockClerkService);
    });

    var context;
    inject(function ($controller, $location, $rootScope, auth, $httpBackend) {

      var errors = [];
      $rootScope.addError = err => errors.push(err);
      $rootScope.addAuthorizationError = $rootScope.addError;
      $rootScope.loadLimits = () => {};
      $httpBackend.whenGET(/partials\/.*\.html/).respond(200, '');

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
      var controller = createController('LoginCtrl');
      var loginform = {};
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
      controller.email = email;
      controller.password = password;
      controller.submitLogin(loginform);
      $httpBackend.flush();

      // Assert
      expect($location.path()).toBe('/reports');
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
      var controller = createController('LoginCtrl');
      var loginform = {
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
      controller.email = email;
      controller.password = password;
      controller.submitLogin(loginform);
      $httpBackend.flush();

      // Assert
      expect($location.path()).toBe('/login');
      expect(auth.isAuthed()).toBe(false);
    });
  });

  describe('visiting /login with an existing session', () => {
    it('should redirect an already-authenticated user to /reports and keep the session', () => {
      // Arrange
      var { $location, $scope, auth } = createContext();
      auth.loginByToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);

      // Act
      $location.path('/login');
      $scope.$apply();

      // Assert
      expect($location.path()).toBe('/reports');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.getUserName()).toBe('amoschini@makingsense.com');
    });

    it('should clear the temporal session and stay on /login when the user is only temporally authed', () => {
      // Arrange
      var { $location, $scope, auth } = createContext();
      auth.loginByToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE0ODQ2MjAxMjEsImV4cCI6MTUyODIwNDQzNCwiaWF0IjoxNDg0NjIwMTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwidW5pcXVlX25hbWUiOiJhbW9zY2hpbmkrMUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9vbl9wYXNzd29yZF9yZXNldCI6dHJ1ZSwicmVsYXlfdGVtcG9yYWxfdG9rZW4iOnRydWV9.gecKe6J6zQL7mHceq42fgjdpTUcVeQEBtSNp0mbI6Ig');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(true);

      // Act
      $location.path('/login');
      $scope.$apply();

      // Assert
      expect($location.path()).toBe('/login');
      expect(auth.isAuthed()).toBe(false);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });
  });
});
