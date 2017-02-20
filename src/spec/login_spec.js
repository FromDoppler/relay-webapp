describe('Login page', () => {
  var LoginPage = require('./page-objects/login-page').LoginPage;

  it('should show switch language message in inverse language', () => {
    // Arrange
    var loginPage = new LoginPage();
    var inEnglish = "Speak English? Change it here";
    var inSpanish = "¿Hablas Español? Cámbialo aquí";

    // Act
    loginPage.get('lang=es');
    // Assert
    expect(loginPage.getSwitchLanguageMessage()).toBe(inEnglish);

    // Act
    loginPage.get('lang=en');
    // Assert
    expect(loginPage.getSwitchLanguageMessage()).toBe(inSpanish);

    // Act
    loginPage.clickEsFlag();
    // Assert
    expect(loginPage.getSwitchLanguageMessage()).toBe(inEnglish);

    // Act
    loginPage.clickEnFlag();
    // Assert
    expect(loginPage.getSwitchLanguageMessage()).toBe(inSpanish);


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
