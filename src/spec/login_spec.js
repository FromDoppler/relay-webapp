describe('Login page', () => {
  var LoginPage = require('./page-objects/login-page').LoginPage;

  it('should show switch language message in inverse language', () => {

    // Arrange
    browser.addMockModule('descartableModule', () => angular
    .module('descartableModule', ['ngMockE2E'])
    .run($httpBackend => {
      $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
        "data" : ""
     });
    }));
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
});
