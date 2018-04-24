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

  it('should show login admin page correctly', () => {
    
    // Arrange
    var loginPage = new LoginPage();

    // Act
    browser.get('/#/loginAdmin');

    // Assert
    expect(loginPage.isAdminTitleVisible()).toBe(true);
    expect(loginPage.isAdminEmailAccountInputVisible()).toBe(true);
  });

  it('should log correctly as the user from Admin Page', () => {
    
    // Arrange
    browser.addMockModule('descartableModule', () => angular
    // This code will be executed in the browser context, 
    // so it cannot access variables from outside its scope
    .module('descartableModule', ['ngMockE2E'])
    .run($httpBackend => {
      $httpBackend.whenPOST(/\/tokens\/impersonate/).respond(200, {
        "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1MTMzNjM2MzEsImV4cCI6MTUxMzQ1MDAzMSwiaWF0IjoxNTEzMzYzNjMxLCJpc3MiOiJodHRwOi8vZG9wcGxlcnJlbGF5cWEubWFraW5nc2Vuc2UuY29tOjgwODAiLCJzdWIiOjcwMDc1LCJ1bmlxdWVfbmFtZSI6Im12aWxsYXNlY29AbWFraW5nc2Vuc2UuY29tIiwicmVsYXlfYWNjb3VudHMiOlsiYW0tYWN0aXZlMyJdLCJyZWxheV90b2tlbl92ZXJzaW9uIjoiMS4wLjAtYmV0YTUiLCJpbXBlcnNvbmF0ZWRfYnkiOiJhZ2FyY2lhK2ltcGVyc29uYXRvckBtYWtpbmdzZW5zZS5jb20ifQ.JFXEOSW64e7hcqLXj09s9hljS5D0hVjlegDdRRmzhhcGTRqBPZ3YA-J03NMFeVJGIWXl-hyJUl9Jbh08cP4w9dbCdeWwhBg_QppJHqgYvkbaofiCBcCgrfK_eD_eE4lv4MCXsWRV5b6pNrDUFLJP7SvrTGaaCNgOVHa_MHreH8iLbwBN52L1cj15_OzD6swqDg3UbzlMqWD37_RGDcu_H2ONLyQVJT3NMm_Y_nvdYvTsJwBjl2ZWww0nFqszLQRVIxImMskNvH1yOEmRpaBu9FFSXIo8yRuT_QuthBljOie86c1IKHFIQUc_WI9hFVaXe5-ifM7Ze6OxtomSFJagEQ"
      });
      $httpBackend.whenGET(/\/accounts\/[\w|-]*\/status\/limits/).respond(200, {
        "data" : ""
     });
    }));
    var loginPage = new LoginPage();

    // Act
    browser.get('/#/loginAdmin');
    loginPage.setAdminEmail('testAdmin@test.com');
    loginPage.setAdminPassword('test1234');
    loginPage.setClientEmail('testUser@test.com');
    loginPage.clickAdminLoginButton();
    

    // Assert
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/reports');
  });

  it('should show the word Relay in the title', () => {
    
    // Arrange
    var loginPage = new LoginPage();
    var inEnglish = "Login to Doppler Relay";
    var inSpanish = "Ingresa a Doppler Relay";

    // Act
    loginPage.get('lang=es');
    // Assert
    expect(loginPage.getRelayTextDisplayed()).toBe(inSpanish);

    // Act
    loginPage.get('lang=en');
    // Assert
    expect(loginPage.getRelayTextDisplayed()).toBe(inEnglish);
  });

  it('should not show any custom icons in the header', () => {
    
    // Arrange
    var loginPage = new LoginPage();

    // Act
    browser.get('/#/login');    

    // Assert
    expect(loginPage.isHeaderIconCustom()).toBe(false);    
  });
  it('should not show any custom icons in footer', () => {
    
    // Arrange
    var loginPage = new LoginPage();

    // Act
    browser.get('/#/login');    

    // Assert
    expect(loginPage.isDefaultFooterDisplayed()).toBe(false);
  });
});
