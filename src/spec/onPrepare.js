browser.addMockModule('commonModule', () => angular
  .module('commonModule', ['ngMockE2E'])
  .run(($httpBackend, jwtHelper, auth) => {

    // To allow to load partial views
    $httpBackend.whenGET(/(\.htm|\.html)$/).passThrough();

    // To not pay attention to token expiration date
    jwtHelper.isTokenExpired = () => false;

    // To start the tests without an authenticated session
    auth.logOut();
  }));
