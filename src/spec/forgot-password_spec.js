describe('Forgot password', () => {
  // Useful references:
  // http://www.protractortest.org/#/style-guide
  // http://www.protractortest.org/#/locators
  // http://www.protractortest.org/#/page-objects
  // http://www.protractortest.org/#/api-overview
  // http://www.protractortest.org/#/api
  // https://gist.github.com/javierarques/0c4c817d6c77b0877fda

  var LoginPage = require('./page-objects/login-page').LoginPage;

  afterEach(() => {
    // each spec should remove registered modules
    browser.removeMockModule('descartableModule');
  });

  it('should not show successful message when there were an error', () => {
    // Arrange
    browser.addMockModule('descartableModule', () => angular
      // This code will be executed in the browser context, 
      // so it cannot access variables from outside its scope
      .module('descartableModule', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenPUT(/\/user\/password\/recover/).respond(500, {});
      }));

    var loginPage = new LoginPage();

    // Act
    loginPage.get();
    loginPage.toggleForgotPassword();
    loginPage.setForgotEmail('andresmoschini@gmail.com');
    loginPage.submitForgot();

    // Assert
    expect(loginPage.isForgotSubmitConfirmationDisplayed()).toBeFalsy();
    expect(loginPage.isErrorModalDisplayed()).toBeTruthy();
  });

  it('should call API and show a successful message', () => {
    // Arrange
    browser.addMockModule('descartableModule', () => angular
      .module('descartableModule', ['ngMockE2E'])
      .run($httpBackend => {
        $httpBackend.whenPUT(/\/user\/password\/recover/).respond(201, {
          'message': 'We have sent an email to your email address to continue with the registration process...'
        });
      }));

    var loginPage = new LoginPage();

    // Act
    loginPage.get();
    loginPage.toggleForgotPassword();
    loginPage.setForgotEmail('andresmoschini@gmail.com');
    loginPage.submitForgot();

    // Assert
    expect(loginPage.isForgotSubmitConfirmationDisplayed()).toBeTruthy();
    expect(loginPage.isErrorModalDisplayed()).toBeFalsy();
  });
});
