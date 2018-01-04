'use strict';

describe('Routing', () => {

  function createContext() {
    // Ugly patch, localStorage should be cleaned before initialize module
    localStorage.clear();

    module('dopplerRelay');
    var context;
    inject(function ($controller, $location, $rootScope, auth, $httpBackend, jwtHelper) {

      var errors = [];
      $rootScope.addError = err => errors.push(err);
      $rootScope.addAuthorizationError = $rootScope.addError;
      $rootScope.loadLimits = () => {};

      context = {
        errors: errors,
        $location: $location,
        $rootScope: $rootScope,
        $scope: $rootScope.$new(),
        $httpBackend: $httpBackend,
        jwtHelper: jwtHelper,
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

  describe('page that requires temporal auth', () => {

    it('should start auth session when temporalToken parameter is set (no previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      expect(auth.isAuthed()).toBe(false);
      jwtHelper.isTokenExpired = () => false;

      // Act
      $location.path('/reset-password');
      $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MjAxMjEsImV4cCI6MTQ4NDYyMzcyMSwiaWF0IjoxNDg0NjIwMTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwidW5pcXVlX25hbWUiOiJhbW9zY2hpbmkrMUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9vbl9wYXNzd29yZF9yZXNldCI6dHJ1ZX0.dEFvbFzwmMDckjTPdih2WjC5fkkXMEirOxQcptJOh_vUtOU8c6psldSt4TsfL6znkFi2df9I4LVDnLUHVZG_PClkukqvQZ_EKJrUdx4PhGeRn9GL_bpYlOXr_G4VPs9h4s20Rq8fWDC4uYKIncXgQtP-po1VZHez8RyRv-xVUKTRouFfdt29usu_DPscvpVFn0P_J4qxkGnWcsHWGmexEVBbMP8_W_YCxz23FgH8vjkNo54j1wWFsOfxzZivNG92kgPcTE4PVXxn4y4yRmRS03m1mpnEL46CZ127utyhRSg91f4Imz3kgM6t4cpacxObUOMWdw86kL2flSbYUh4pxQ'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/reset-password');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(true);
      expect(auth.getUserName()).toBe('amoschini+1@makingsense.com');
    });

    it('should start auth session when temporalToken parameter is set (already previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => false;

      // set a global (localStorage) token
      auth.saveToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
      expect(auth.getUserName()).toBe('amoschini@makingsense.com');

      // Act
      $location.path('/reset-password');
      $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MjAxMjEsImV4cCI6MTQ4NDYyMzcyMSwiaWF0IjoxNDg0NjIwMTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwidW5pcXVlX25hbWUiOiJhbW9zY2hpbmkrMUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9vbl9wYXNzd29yZF9yZXNldCI6dHJ1ZX0.dEFvbFzwmMDckjTPdih2WjC5fkkXMEirOxQcptJOh_vUtOU8c6psldSt4TsfL6znkFi2df9I4LVDnLUHVZG_PClkukqvQZ_EKJrUdx4PhGeRn9GL_bpYlOXr_G4VPs9h4s20Rq8fWDC4uYKIncXgQtP-po1VZHez8RyRv-xVUKTRouFfdt29usu_DPscvpVFn0P_J4qxkGnWcsHWGmexEVBbMP8_W_YCxz23FgH8vjkNo54j1wWFsOfxzZivNG92kgPcTE4PVXxn4y4yRmRS03m1mpnEL46CZ127utyhRSg91f4Imz3kgM6t4cpacxObUOMWdw86kL2flSbYUh4pxQ'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/reset-password');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(true);
      expect(auth.getUserName()).toBe('amoschini+1@makingsense.com');
    });

    it('should redirect to error when temporal token is not set (no previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      expect(auth.isAuthed()).toBe(false);
      jwtHelper.isTokenExpired = () => false;

      // Act
      $location.path('/reset-password');
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/temporal-token-error');
      expect(auth.isAuthed()).toBe(false);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect to error when temporal token is not set (already previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => false;

      // set a global (localStorage) token
      auth.saveToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
      expect(auth.getUserName()).toBe('amoschini@makingsense.com');

      // Act
      $location.path('/reset-password');
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/temporal-token-error');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect to error when temporal token is invalid (no previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => false;
      expect(auth.isAuthed()).toBe(false);

      // Act
      $location.path('/reset-password');
      $location.search({ temporalToken: 'invalid'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/temporal-token-error');
      expect(auth.isAuthed()).toBe(false);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect to error when temporal token is invalid (already previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => false;

      // set a global (localStorage) token
      auth.saveToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
      expect(auth.getUserName()).toBe('amoschini@makingsense.com');

      // Act
      $location.path('/reset-password');
      $location.search({ temporalToken: 'invalid'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/temporal-token-error');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect to error when temporal token is expired (no previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => true;
      expect(auth.isAuthed()).toBe(false);

      // Act
      $location.path('/reset-password');
      $location.search({ temporalToken: 'invalid'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/temporal-token-error');
      expect(auth.isAuthed()).toBe(false);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect to error when temporal token is expired (already previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => true;
      // set a global (localStorage) token
      auth.saveToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
      expect(auth.getUserName()).toBe('amoschini@makingsense.com');

      // Act
      $location.path('/reset-password');
      $location.search({ temporalToken: 'invalid'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/temporal-token-error');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect automatically into the app after new password is setted', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper, createController, $httpBackend } = createContext();
      $location.path('/reset-password');
      auth.saveToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MjAxMjEsImV4cCI6MTQ4NDYyMzcyMSwiaWF0IjoxNDg0NjIwMTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwidW5pcXVlX25hbWUiOiJhbW9zY2hpbmkrMUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9vbl9wYXNzd29yZF9yZXNldCI6dHJ1ZX0.dEFvbFzwmMDckjTPdih2WjC5fkkXMEirOxQcptJOh_vUtOU8c6psldSt4TsfL6znkFi2df9I4LVDnLUHVZG_PClkukqvQZ_EKJrUdx4PhGeRn9GL_bpYlOXr_G4VPs9h4s20Rq8fWDC4uYKIncXgQtP-po1VZHez8RyRv-xVUKTRouFfdt29usu_DPscvpVFn0P_J4qxkGnWcsHWGmexEVBbMP8_W_YCxz23FgH8vjkNo54j1wWFsOfxzZivNG92kgPcTE4PVXxn4y4yRmRS03m1mpnEL46CZ127utyhRSg91f4Imz3kgM6t4cpacxObUOMWdw86kL2flSbYUh4pxQ', true);
      $scope.form = {};
      var controller = createController('ResetPasswordCtrl');
      
      $httpBackend.expect(
        'PUT',
        url => url.includes('/user/password?lang='),
        '{"password":"testPass123"}')
        .respond({
          "success": true
        });

      $httpBackend.expect(
        'POST',
        url => url.endsWith('/tokens'),
        '{"username":"amoschini+1@makingsense.com","password":"testPass123"}')
        .respond({
          "access_token": 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ'
        });

        $scope.$apply();
        expect(auth.isTemporarilyAuthed()).toBe(true);
        expect($location.path()).toBe('/reset-password');

      // Act
      $scope.resetPassword = 'testPass123';
      controller.submitResetPassword();
      $httpBackend.flush();

      // Assert
      //after this it will redirect to reports
      expect($location.path()).toBe('/');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

  });

  describe('page that does not support temporal auth', () => {

    it('should redirect to login when temporalToken parameter is set (no previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => false;
      expect(auth.getUserName()).toBe(null);
      expect(auth.isAuthed()).toBe(false);

      // Act
      $location.path('/reports');
      $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MjAxMjEsImV4cCI6MTQ4NDYyMzcyMSwiaWF0IjoxNDg0NjIwMTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwidW5pcXVlX25hbWUiOiJhbW9zY2hpbmkrMUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9vbl9wYXNzd29yZF9yZXNldCI6dHJ1ZX0.dEFvbFzwmMDckjTPdih2WjC5fkkXMEirOxQcptJOh_vUtOU8c6psldSt4TsfL6znkFi2df9I4LVDnLUHVZG_PClkukqvQZ_EKJrUdx4PhGeRn9GL_bpYlOXr_G4VPs9h4s20Rq8fWDC4uYKIncXgQtP-po1VZHez8RyRv-xVUKTRouFfdt29usu_DPscvpVFn0P_J4qxkGnWcsHWGmexEVBbMP8_W_YCxz23FgH8vjkNo54j1wWFsOfxzZivNG92kgPcTE4PVXxn4y4yRmRS03m1mpnEL46CZ127utyhRSg91f4Imz3kgM6t4cpacxObUOMWdw86kL2flSbYUh4pxQ'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/login');
      expect(auth.isAuthed()).toBe(false);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect to login when temporalToken parameter is set (already previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => false;

      // set a real stored token
      auth.saveToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
      expect(auth.getUserName()).toBe('amoschini@makingsense.com');

      // Act
      $location.path('/reports');
      $location.search({ temporalToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MjAxMjEsImV4cCI6MTQ4NDYyMzcyMSwiaWF0IjoxNDg0NjIwMTIxLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwidW5pcXVlX25hbWUiOiJhbW9zY2hpbmkrMUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9vbl9wYXNzd29yZF9yZXNldCI6dHJ1ZX0.dEFvbFzwmMDckjTPdih2WjC5fkkXMEirOxQcptJOh_vUtOU8c6psldSt4TsfL6znkFi2df9I4LVDnLUHVZG_PClkukqvQZ_EKJrUdx4PhGeRn9GL_bpYlOXr_G4VPs9h4s20Rq8fWDC4uYKIncXgQtP-po1VZHez8RyRv-xVUKTRouFfdt29usu_DPscvpVFn0P_J4qxkGnWcsHWGmexEVBbMP8_W_YCxz23FgH8vjkNo54j1wWFsOfxzZivNG92kgPcTE4PVXxn4y4yRmRS03m1mpnEL46CZ127utyhRSg91f4Imz3kgM6t4cpacxObUOMWdw86kL2flSbYUh4pxQ'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/login');
      expect(auth.isAuthed()).toBe(false);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect to error when temporalToken parameter is invalid (no previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => false;
      expect(auth.getUserName()).toBe(null);
      expect(auth.isAuthed()).toBe(false);

      // Act
      $location.path('/reports');
      $location.search({ temporalToken: 'invalid'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/temporal-token-error');
      expect(auth.isAuthed()).toBe(false);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect to error when temporalToken parameter is invalid (already previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => false;

      // set a real stored token
      auth.saveToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
      expect(auth.getUserName()).toBe('amoschini@makingsense.com');

      // Act
      $location.path('/reports');
      $location.search({ temporalToken: 'invalid'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/temporal-token-error');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect to error when temporalToken parameter is expired (no previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => true;
      expect(auth.getUserName()).toBe(null);
      expect(auth.isAuthed()).toBe(false);

      // Act
      $location.path('/reports');
      $location.search({ temporalToken: 'invalid'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/temporal-token-error');
      expect(auth.isAuthed()).toBe(false);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });

    it('should redirect to error when temporalToken parameter is expired (already previous authenticated session)', () => {
      // Arrange
      var { $location, $scope, auth, jwtHelper } = createContext();
      jwtHelper.isTokenExpired = () => true;

      // set a real stored token
      auth.saveToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0ODQ2MzAzMTgsImV4cCI6MTQ4NzIyMjMxOCwiaWF0IjoxNDg0NjMwMzE4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjM0NzUxIiwic3ViIjoxMDAzLCJ1bmlxdWVfbmFtZSI6ImFtb3NjaGluaUBtYWtpbmdzZW5zZS5jb20iLCJyZWxheV9hY2NvdW50cyI6WyJhbW9zY2hpbmktbWFraW5nc2Vuc2UiXSwicmVsYXlfdG9rZW5fdmVyc2lvbiI6IjEuMC4wLWJldGE1In0.dQh20ukVSCP0rNXMWBh2DlPQXbP0uTaYzadRDNPXECI9lvCsgDKNXc2bToXAUQDeXw90kbHliVF-kCueW4gQLPBtMJOcHQFv6LfgspsG2jue2iMwoBC1q6UB_4xFlGoyhkRjldnQUV0oqBTzhFdXuTvQz53kRPiqILCHkd4FLl4KliBgdaDRwWz-HIjJwinMpnv_7V38CNvHlHo-q2XU0MnE3CsGXmWGoAgzN7rbeQPgI9azHXpbaUPh9n_4zjCydOSBC5tx7MtEAx3ivfFYImBPp2T2vUM-F5AwRh7hl_lMUvyQLal0S_spoT0XMGy8YhnjxXLoZeVRisWbxBmucQ');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
      expect(auth.getUserName()).toBe('amoschini@makingsense.com');

      // Act
      $location.path('/reports');
      $location.search({ temporalToken: 'invalid'});
      $scope.$apply(); // To run app.js code

      // Assert
      expect($location.path()).toBe('/temporal-token-error');
      expect(auth.isAuthed()).toBe(true);
      expect(auth.isTemporarilyAuthed()).toBe(false);
    });
  });
});
