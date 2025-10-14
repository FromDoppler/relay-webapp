'use strict';

window.ClerkTestHelpers = {
  /**
   * Creates a mock clerk service with configurable return values
   * @param {Object} overrides - Object with methods to override and their return values
   * @returns {Object} Mock clerk service
   */
  createClerkMock: function(overrides) {
    overrides = overrides || {};

    var defaults = {
      isAuthenticated: Promise.resolve(false),
      getToken: Promise.resolve('mock-token'),
      login: Promise.resolve({ authenticated: false }),
      logout: Promise.resolve(),
      signUp: Promise.resolve({ registered: true }),
      verifyOtp: Promise.resolve({ verified: true }),
      resendOtp: Promise.resolve({ sent: true }),
      mountUserButton: Promise.resolve()
    };

    var mock = {};

    for (var method in defaults) {
      var returnValue = overrides.hasOwnProperty(method) ? overrides[method] : defaults[method];
      mock[method] = jasmine.createSpy(method).and.returnValue(returnValue);
    }

    return mock;
  },

  /**
   * Creates a mock for window.Clerk object (for integration tests that need the global object)
   * @returns {Object} Mock window.Clerk object
   */
  createWindowClerkMock: function() {
    return {
      load: jasmine.createSpy('load').and.returnValue(Promise.resolve({
        client: {
          signIn: {},
          signUp: {}
        },
        session: {
          getToken: jasmine.createSpy('getToken').and.returnValue(Promise.resolve('mock-token')),
          status: 'inactive'
        }
      })),
      localizations: {
        es: {}
      }
    };
  }
};
